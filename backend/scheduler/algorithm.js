const Subject = require("../models/Subject");
const Room = require("../models/Room");
const TimeSlot = require("../models/TimeSlot");
const Timetable = require("../models/Timetable");

async function generateTimetable() {

  const subjects = await Subject.find()
    .populate("teachers")
    .populate("sections");

  const rooms = await Room.find();
  const timeslots = await TimeSlot.find();

  let timetable = [];

  let teacherBusy = {};
  let roomBusy = {};
  let sectionBusy = {};
  let subjectDayMap = {};

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

  // MAIN ALGO
  for (let session of queue) {

    let scheduled = false;

    let totalStudents = session.sections.reduce((sum, sec) => {
      return sum + sec.strength;
    }, 0);

    for (let slot of timeslots) {

      if (subjectDayMap[session._id].has(slot.day)) continue;

      // FILTER ROOMS
      let validRooms = rooms.filter(r =>
        r.type === (session.type === "lab" ? "lab" : "classroom")
      );

      // 🔥 SMART SORT
      validRooms.sort((a, b) => {

        // same building + floor
        if (a.building === b.building && a.floor === b.floor) {
          return a.capacity - b.capacity;
        }

        // same building
        if (a.building === b.building) return -1;

        // alphabetical building
        return a.building.localeCompare(b.building);
      });

      // 🔥 COMBINATION
      let selectedRooms = [];
      let capacitySum = 0;

      for (let room of validRooms) {

        let roomKey = room.id + "_" + slot._id;
        if (roomBusy[roomKey]) continue;

        selectedRooms.push(room);
        capacitySum += room.capacity;

        if (capacitySum >= totalStudents) break;
      }

      // ❌ not enough capacity
      if (capacitySum < totalStudents) continue;

      // CHECK TEACHER
      let teacherFree = session.teachers.every(t =>
        !teacherBusy[t.id + "_" + slot._id]
      );

      // CHECK SECTION
      let sectionFree = session.sections.every(sec =>
        !sectionBusy[sec.id + "_" + slot._id]
      );

      if (teacherFree && sectionFree) {

        // ✅ SINGLE ENTRY (IMPORTANT FIX)
        timetable.push({
          subject: session._id,
          teacher: session.teachers.map(t => t._id),
          room: selectedRooms.map(r => r._id), // 🔥 MULTIPLE ROOMS
          timeslot: slot._id,
          sections: session.sections.map(s => s._id)
        });

        // MARK ROOMS BUSY
        for (let room of selectedRooms) {
          let roomKey = room.id + "_" + slot._id;
          roomBusy[roomKey] = true;
        }

        // MARK TEACHER
        for (let teacher of session.teachers) {
          teacherBusy[teacher.id + "_" + slot._id] = true;
        }

        // MARK SECTION
        for (let sec of session.sections) {
          sectionBusy[sec.id + "_" + slot._id] = true;
        }

        subjectDayMap[session._id].add(slot.day);

        scheduled = true;
        break;
      }
    }

    if (!scheduled) {
      failedSubjects.push(session.name || "Unknown");
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