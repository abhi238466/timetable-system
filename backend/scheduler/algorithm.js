const Subject = require("../models/Subject");
const Room = require("../models/Room");
const TimeSlot = require("../models/TimeSlot");
const Timetable = require("../models/Timetable");

async function generateTimetable() {

  const subjects = await Subject.find()
    .populate("teachers")
    .populate("sections");

  const rooms = await Room.find();
  const timeslotsRaw = await TimeSlot.find();

  // ✅ FIX: DAY ORDER + TIME SORT (MAIN BUG FIX)
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  const timeslots = timeslotsRaw.sort((a, b) => {
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }
    return a.startTime.localeCompare(b.startTime);
  });

  let timetable = [];

  let teacherBusy = {};
  let roomBusy = {};
  let sectionBusy = {};
  let subjectDayMap = {};
  let sectionGapUsed = {};

  let failedSubjects = [];

  // INIT
  for (let slot of timeslots) {
    for (let room of rooms) {
      roomBusy[room.id + "_" + slot._id] = false;
    }
  }

  for (let subject of subjects) {

    for (let teacher of subject.teachers) {
      for (let slot of timeslots) {
        teacherBusy[teacher.id + "_" + slot._id] = false;
      }
    }

    for (let section of subject.sections) {
      for (let slot of timeslots) {
        sectionBusy[section.id + "_" + slot._id] = false;
      }

      sectionGapUsed[section.id] = {};
    }

    subjectDayMap[subject._id] = new Set();
  }

  // QUEUE
  let queue = [];

  for (let subject of subjects) {
    for (let i = 0; i < subject.weeklyFrequency; i++) {
      queue.push(subject);
    }
  }

  queue.sort(() => Math.random() - 0.5);

  // MAIN LOOP
  for (let session of queue) {

    let scheduled = false;

    let totalStudents = session.sections.reduce((sum, sec) => {
      return sum + sec.strength;
    }, 0);

    for (let i = 0; i < timeslots.length; i++) {

      let slot = timeslots[i];

      if (subjectDayMap[session._id].has(slot.day)) continue;

      // 🔥 GAP TRY
      for (let gap = 0; gap <= 2; gap++) {

        let index = i + gap;
        if (index >= timeslots.length) continue;

        let trySlot = timeslots[index];

        // 🔥 GAP RULE (UNCHANGED)
        let gapAllowed = session.sections.every(sec => {
          if (gap === 0) return true;
          return !sectionGapUsed[sec.id][trySlot.day];
        });

        if (!gapAllowed) continue;

        // ROOM FILTER
        let validRooms = rooms.filter(r =>
          r.type === (session.type === "lab" ? "lab" : "classroom")
        );

        validRooms.sort((a, b) => {
          if (a.building === b.building && a.floor === b.floor) {
            return a.capacity - b.capacity;
          }
          if (a.building === b.building) return -1;
          return a.building.localeCompare(b.building);
        });

        let selectedRoom = null;

        for (let room of validRooms) {
          let key = room.id + "_" + trySlot._id;

          if (!roomBusy[key] && room.capacity >= totalStudents) {
            selectedRoom = room;
            break;
          }
        }

        if (!selectedRoom) continue;

        let teacherFree = session.teachers.every(t =>
          !teacherBusy[t.id + "_" + trySlot._id]
        );

        let sectionFree = session.sections.every(sec =>
          !sectionBusy[sec.id + "_" + trySlot._id]
        );

        if (teacherFree && sectionFree) {

          timetable.push({
            subject: session._id,
            teacher: session.teachers.map(t => t._id),
            room: selectedRoom._id,
            timeslot: trySlot._id,
            sections: session.sections.map(s => s._id)
          });

          roomBusy[selectedRoom.id + "_" + trySlot._id] = true;

          session.teachers.forEach(t => {
            teacherBusy[t.id + "_" + trySlot._id] = true;
          });

          session.sections.forEach(sec => {
            sectionBusy[sec.id + "_" + trySlot._id] = true;

            if (gap > 0) {
              sectionGapUsed[sec.id][trySlot.day] = true;
            }
          });

          subjectDayMap[session._id].add(trySlot.day);

          scheduled = true;
          break;
        }
      }

      if (scheduled) break;
    }

    // ❌ FAILURE (UNCHANGED)
    if (!scheduled) {

      let reason = "";

      if (session.teachers.length === 0) {
        reason = "No teacher assigned";
      } else if (session.sections.length === 0) {
        reason = "No section assigned";
      } else {

        let teacherIssue = false;
        let roomIssue = false;

        for (let slot of timeslots) {

          let teacherFree = session.teachers.every(t =>
            !teacherBusy[t.id + "_" + slot._id]
          );

          let roomAvailable = rooms.some(r =>
            r.capacity >= totalStudents &&
            !roomBusy[r.id + "_" + slot._id]
          );

          if (!teacherFree) teacherIssue = true;
          if (!roomAvailable) roomIssue = true;
        }

        if (teacherIssue && roomIssue) {
          reason = "Teacher + Room unavailable";
        } else if (teacherIssue) {
          reason = "Teacher busy all slots";
        } else if (roomIssue) {
          reason = "Room capacity / availability issue";
        } else {
          reason = "Gap limit / slot distribution issue";
        }
      }

      failedSubjects.push({
        subject: session.name,
        requiredPerWeek: session.weeklyFrequency,
        reason
      });
    }
  }

  await Timetable.deleteMany({});
  await Timetable.insertMany(timetable);

  return {
    timetable,
    failedSubjects
  };
}

module.exports = { generateTimetable };