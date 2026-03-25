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

  let sectionRoomMap = {};

  // INIT
  for (let slot of timeslots) {
    for (let room of rooms) {
      roomBusy[room._id + "_" + slot._id] = false;
    }
  }

  for (let subject of subjects) {

    for (let teacher of subject.teachers) {
      for (let slot of timeslots) {
        teacherBusy[teacher._id + "_" + slot._id] = false;
      }
    }

    for (let section of subject.sections) {

      for (let slot of timeslots) {
        sectionBusy[section._id + "_" + slot._id] = false;
      }

      // 🔥 assign 2 nearby rooms
      if (!sectionRoomMap[section._id]) {

        let filteredRooms = rooms.filter(r =>
          r.type === (subject.type === "lab" ? "lab" : "classroom")
        );

        filteredRooms.sort((a, b) => {
          if (a.building === b.building) {
            return a.floor - b.floor;
          }
          return a.building.localeCompare(b.building);
        });

        sectionRoomMap[section._id] = filteredRooms.slice(0, 2);
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

  queue.sort(() => Math.random() - 0.5);

  // ALGORITHM
  for (let session of queue) {

    let scheduled = false;

    for (let slot of timeslots) {

      if (subjectDayMap[session._id].has(slot.day)) continue;

      // 🔥 total students (for lab combine)
      let totalStudents = session.sections.reduce((sum, sec) => {
        return sum + sec.strength;
      }, 0);

      for (let room of rooms) {

        // TYPE CHECK
        if (session.type === "theory" && room.type !== "classroom") continue;
        if (session.type === "lab" && room.type !== "lab") continue;

        // 🔥 CAPACITY CHECK
        if (room.capacity < totalStudents) continue;

        let teacherFree = true;

        for (let teacher of session.teachers) {
          let teacherKey = teacher._id + "_" + slot._id;
          if (teacherBusy[teacherKey]) {
            teacherFree = false;
            break;
          }
        }

        let roomKey = room._id + "_" + slot._id;

        let sectionFree = true;

        for (let sec of session.sections) {
          let sectionKey = sec._id + "_" + slot._id;
          if (sectionBusy[sectionKey]) {
            sectionFree = false;
            break;
          }
        }

        if (teacherFree && !roomBusy[roomKey] && sectionFree) {

          timetable.push({
            subject: session._id,
            teacher: session.teachers.map(t => t._id), // 🔥 multiple teacher
            room: room._id,
            timeslot: slot._id,
            sections: session.sections.map(s => s._id) // 🔥 multiple section
          });

          // MARK BUSY
          for (let teacher of session.teachers) {
            let teacherKey = teacher._id + "_" + slot._id;
            teacherBusy[teacherKey] = true;
          }

          roomBusy[roomKey] = true;

          for (let sec of session.sections) {
            let sectionKey = sec._id + "_" + slot._id;
            sectionBusy[sectionKey] = true;
          }

          subjectDayMap[session._id].add(slot.day);

          scheduled = true;
          break;
        }
      }

      if (scheduled) break;
    }
  }

  await Timetable.deleteMany({});
  await Timetable.insertMany(timetable);

  return timetable;
}

module.exports = { generateTimetable };