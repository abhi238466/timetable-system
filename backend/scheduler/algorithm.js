//Real Backtracking
//Real Backtracking
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

  const dayOrder = {
    Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  };

  // ✅ Timeslots sorted by day → startTime (9AM pehle)
  const timeslots = timeslotsRaw.sort((a, b) => {
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }
    return a.startTime.localeCompare(b.startTime);
  });

  let timetable = [];

  // ── Busy Maps ─────────────────────────────────────────
  let teacherBusy = {};   // teacherId_slotId → bool
  let roomBusy    = {};   // roomId_slotId    → bool
  let sectionBusy = {};   // sectionId_slotId → bool

  // ── Per-day tracking ──────────────────────────────────
  //
  // sectionGapUsed[sectionId][day] = true
  //   → Yeh section is din gap le chuka (individual ya combined)
  //   → Ek baar gap liya → us din dobara nahi milega
  //   → Combined mein liya → individual ko nahi milega aur vice versa
  //
  // subjectSectionTypeDay[subjectId_sectionId_type] = Set<day>
  //   → CSE-A DBMS theory → "dbmsId_cseAId_classroom"
  //   → CSE-A DBMS lab    → "dbmsId_cseAId_lab"      (alag key → allowed)
  //   → CSE-B DBMS theory → "dbmsId_cseBId_classroom" (alag key → allowed)
  //   → CSE-A DBMS theory dobara → same key → BLOCKED
  //   → CSE-A DBMS lab dobara    → same key → BLOCKED
  //
  let sectionGapUsed        = {};  // sectionId → { day → bool }
  let subjectSectionTypeDay = {};  // key → Set<day>

  const TIME_LIMIT = 15000;
  const genStart   = Date.now();
  let   timedOut   = false;

  // =============================================
  // INIT
  // =============================================
  for (const slot of timeslots) {
    for (const room of rooms) {
      roomBusy[room.id + "_" + slot._id] = false;
    }
  }

  for (const subject of subjects) {
    for (const teacher of subject.teachers) {
      for (const slot of timeslots) {
        teacherBusy[teacher.id + "_" + slot._id] = false;
      }
    }
    for (const section of subject.sections) {
      for (const slot of timeslots) {
        sectionBusy[section.id + "_" + slot._id] = false;
      }
      sectionGapUsed[section.id] = {};
    }
  }

  // =============================================
  // QUEUE
  // =============================================
  let queue = [];
  for (const subject of subjects) {
    for (let i = 0; i < subject.weeklyFrequency; i++) {
      queue.push(subject);
    }
  }
  queue.sort((a, b) => b.weeklyFrequency - a.weeklyFrequency);

  // subjectSectionTypeDay init
  for (const session of queue) {
    const typeKey = session.type === "lab" ? "lab" : "classroom";
    for (const section of session.sections) {
      const key = session._id + "_" + section._id + "_" + typeKey;
      if (!subjectSectionTypeDay[key]) {
        subjectSectionTypeDay[key] = new Set();
      }
    }
  }

  // =============================================
  // HELPERS
  // =============================================

  // Ek section ko ek din mein same subject+type dobara nahi
  // BUT theory + lab = alag type = allowed
  // CSE-A ka block CSE-B ko affect nahi karta
  function isSubjectTypeDayBlocked(session, day) {
    const typeKey = session.type === "lab" ? "lab" : "classroom";
    return session.sections.some(sec => {
      const key = session._id + "_" + sec._id + "_" + typeKey;
      return subjectSectionTypeDay[key] && subjectSectionTypeDay[key].has(day);
    });
  }

  function markSubjectTypeDay(session, day) {
    const typeKey = session.type === "lab" ? "lab" : "classroom";
    session.sections.forEach(sec => {
      const key = session._id + "_" + sec._id + "_" + typeKey;
      if (subjectSectionTypeDay[key]) subjectSectionTypeDay[key].add(day);
    });
  }

  function unmarkSubjectTypeDay(session, day) {
    const typeKey = session.type === "lab" ? "lab" : "classroom";
    session.sections.forEach(sec => {
      const key = session._id + "_" + sec._id + "_" + typeKey;
      if (subjectSectionTypeDay[key]) subjectSectionTypeDay[key].delete(day);
    });
  }

  // =============================================
  // BACKTRACKING
  // =============================================
  function backtrack(queueIndex) {

    if (Date.now() - genStart > TIME_LIMIT) {
      timedOut = true;
      return false;
    }

    if (queueIndex === queue.length) return true;

    const session = queue[queueIndex];
    const typeKey = session.type === "lab" ? "lab" : "classroom";
    const totalStudents = session.sections.reduce((sum, sec) => sum + sec.strength, 0);

    const validRooms = rooms
      .filter(r => r.type === typeKey && r.capacity >= totalStudents)
      .sort((a, b) => {
        if (a.building === b.building && a.floor === b.floor) return a.capacity - b.capacity;
        if (a.building === b.building) return -1;
        return a.building.localeCompare(b.building);
      });

    for (let i = 0; i < timeslots.length; i++) {

      if (Date.now() - genStart > TIME_LIMIT) {
        timedOut = true;
        return false;
      }

      const baseSlot = timeslots[i];

      // Same subject+type is din kisi section ke liye already scheduled? Skip.
      if (isSubjectTypeDayBlocked(session, baseSlot.day)) continue;

      // ── Gap loop ──────────────────────────────────────
      // gap=0 → baseSlot khud
      // gap=1 → ek slot aage (same day)
      // gap=2 → do slot aage (same day)
      //
      // Preference: pehle gap=0 try karo (no gap, earliest)
      // Agar base slot genuinely blocked → tab gap=1, gap=2
      // Gap sirf same day ke andar
      //
      // Gap rule (SIMPLE — original jaisa):
      //   Ek section ko ek din mein sirf EK baar gap milega
      //   Chahe individual ho ya combined — ek baar liya toh band
      // ─────────────────────────────────────────────────
      for (let gap = 0; gap <= 2; gap++) {

        const index = i + gap;
        if (index >= timeslots.length) break;

        const trySlot = timeslots[index];

        // Same day check
        if (trySlot.day !== baseSlot.day) break;

        if (gap > 0) {

          // Base slot pe genuinely koi block tha?
          const baseTeacherFree = session.teachers.every(t =>
            !teacherBusy[t.id + "_" + baseSlot._id]
          );
          const baseRoomFree = validRooms.some(r =>
            !roomBusy[r.id + "_" + baseSlot._id]
          );
          const baseSectionFree = session.sections.every(sec =>
            !sectionBusy[sec.id + "_" + baseSlot._id]
          );

          // Sab free tha → gap ki zarurat nahi thi
          if (baseTeacherFree && baseRoomFree && baseSectionFree) continue;

          // Kisi bhi section ne is din gap le rakha? → nahi milega
          // (individual + combined dono same flag share karte hain)
          const anyGapUsed = session.sections.some(sec =>
            sectionGapUsed[sec.id] && sectionGapUsed[sec.id][trySlot.day]
          );
          if (anyGapUsed) continue;
        }

        // Teacher aur section free?
        const teacherFree = session.teachers.every(t =>
          !teacherBusy[t.id + "_" + trySlot._id]
        );
        const sectionFree = session.sections.every(sec =>
          !sectionBusy[sec.id + "_" + trySlot._id]
        );

        if (!teacherFree || !sectionFree) continue;

        // Room select
        let selectedRoom = null;
        for (const room of validRooms) {
          if (!roomBusy[room.id + "_" + trySlot._id]) {
            selectedRoom = room;
            break;
          }
        }
        if (!selectedRoom) continue;

        // =============================================
        // ✅ ASSIGN
        // =============================================
        timetable.push({
          subject:  session._id,
          teacher:  session.teachers.map(t => t._id),
          room:     selectedRoom._id,
          timeslot: trySlot._id,
          sections: session.sections.map(s => s._id)
        });

        roomBusy[selectedRoom.id + "_" + trySlot._id] = true;

        session.teachers.forEach(t => {
          teacherBusy[t.id + "_" + trySlot._id] = true;
        });

        // Gap flag — sab sections ke liye ek saath mark karo
        // Taaki combine+alone dono covered hon
        const gapSetFor = [];
        session.sections.forEach(sec => {
          sectionBusy[sec.id + "_" + trySlot._id] = true;
          if (gap > 0 && !sectionGapUsed[sec.id][trySlot.day]) {
            sectionGapUsed[sec.id][trySlot.day] = true;
            gapSetFor.push(sec.id);
          }
        });

        markSubjectTypeDay(session, trySlot.day);

        if (backtrack(queueIndex + 1)) return true;

        // =============================================
        // ↩️ UNDO
        // =============================================
        timetable.pop();

        roomBusy[selectedRoom.id + "_" + trySlot._id] = false;

        session.teachers.forEach(t => {
          teacherBusy[t.id + "_" + trySlot._id] = false;
        });

        session.sections.forEach(sec => {
          sectionBusy[sec.id + "_" + trySlot._id] = false;
        });

        gapSetFor.forEach(secId => {
          delete sectionGapUsed[secId][trySlot.day];
        });

        unmarkSubjectTypeDay(session, trySlot.day);
      }
    }

    return false;
  }

  const success   = backtrack(0);
  const timeTaken = Date.now() - genStart;

  // =============================================
  // SORT — Monday→Saturday, 9AM→last
  // =============================================
  const slotMap = {};
  timeslots.forEach(slot => { slotMap[slot._id.toString()] = slot; });

  function sortTimetable(entries) {
    return [...entries].sort((a, b) => {
      const slotA = slotMap[a.timeslot.toString()];
      const slotB = slotMap[b.timeslot.toString()];
      if (!slotA || !slotB) return 0;
      if (dayOrder[slotA.day] !== dayOrder[slotB.day]) {
        return dayOrder[slotA.day] - dayOrder[slotB.day];
      }
      return slotA.startTime.localeCompare(slotB.startTime);
    });
  }

  // =============================================
  // FAILURE DIAGNOSIS
  // =============================================
  function diagnoseFailures(sessionsToCheck) {
    const failedSubjects = [];
    for (const session of sessionsToCheck) {
      const totalStudents = session.sections.reduce((sum, sec) => sum + sec.strength, 0);
      let reason = "";

      if (session.teachers.length === 0) {
        reason = "No teacher assigned";
      } else if (session.sections.length === 0) {
        reason = "No section assigned";
      } else {
        let teacherIssue = false;
        let roomIssue    = false;

        for (const slot of timeslots) {
          const teacherFree = session.teachers.every(t =>
            !teacherBusy[t.id + "_" + slot._id]
          );
          const roomAvailable = rooms.some(r =>
            r.capacity >= totalStudents &&
            !roomBusy[r.id + "_" + slot._id]
          );
          if (!teacherFree)   teacherIssue = true;
          if (!roomAvailable) roomIssue    = true;
        }

        if (teacherIssue && roomIssue) reason = "Teacher + Room unavailable";
        else if (teacherIssue)         reason = "Teacher busy all slots";
        else if (roomIssue)            reason = "Room capacity / availability issue";
        else                           reason = "Gap limit / slot distribution issue";
      }

      failedSubjects.push({
        subject:         session.name,
        requiredPerWeek: session.weeklyFrequency,
        reason
      });
    }
    return failedSubjects;
  }

  // =============================================
  // 🟢 SUCCESS
  // =============================================
  if (success) {
    const sorted = sortTimetable(timetable);
    await Timetable.deleteMany({});
    await Timetable.insertMany(sorted);
    return {
      status:         "success",
      message:        "Timetable successfully generated",
      timeTaken:      timeTaken + "ms",
      timetable:      sorted,
      failedSubjects: []
    };
  }

  // =============================================
  // 🟡 TIMEOUT — partial + failures
  // =============================================
  if (timedOut) {
    const sorted = sortTimetable(timetable);
    const scheduledIds  = new Set(timetable.map(e => e.subject.toString()));
    const unscheduled   = queue.filter(s => !scheduledIds.has(s._id.toString()));
    const failedSubjects = diagnoseFailures(unscheduled);

    if (sorted.length > 0) {
      await Timetable.deleteMany({});
      await Timetable.insertMany(sorted);
    }

    return {
      status:         "timeout",
      message:        `Time limit (15s) reached. ${sorted.length} sessions scheduled, ${unscheduled.length} could not be placed.`,
      timeTaken:      timeTaken + "ms",
      timetable:      sorted,
      failedSubjects
    };
  }

  // =============================================
  // 🔴 FAILURE
  // =============================================
  const failedSubjects = diagnoseFailures(queue);
  await Timetable.deleteMany({});
  return {
    status:         "failed",
    message:        "No valid timetable exists with current data.",
    timeTaken:      timeTaken + "ms",
    timetable:      [],
    failedSubjects
  };
}

module.exports = { generateTimetable };

// After Lopp Add
// const Subject = require("../models/Subject");
// const Room = require("../models/Room");
// const TimeSlot = require("../models/TimeSlot");
// const Timetable = require("../models/Timetable");

// async function generateTimetable() {

//   const subjects = await Subject.find()
//     .populate("teachers")
//     .populate("sections");

//   const rooms = await Room.find();
//   const timeslotsRaw = await TimeSlot.find();

//   // ✅ DAY ORDER + TIME SORT
//   const dayOrder = {
//     Monday: 1,
//     Tuesday: 2,
//     Wednesday: 3,
//     Thursday: 4,
//     Friday: 5,
//     Saturday: 6
//   };

//   const timeslots = timeslotsRaw.sort((a, b) => {
//     if (dayOrder[a.day] !== dayOrder[b.day]) {
//       return dayOrder[a.day] - dayOrder[b.day];
//     }
//     return a.startTime.localeCompare(b.startTime);
//   });

//   let timetable = [];

//   let teacherBusy = {};
//   let roomBusy = {};
//   let sectionBusy = {};
//   let subjectDayMap = {};
//   let sectionGapUsed = {};

//   // ✅ CASE 2 — TIME LIMIT: 2 seconds ke baad timeout
//   const TIME_LIMIT = 2000;
//   const startTime = Date.now();

//   // ✅ CASE 2 — Track karo timeout hua ya nahi
//   let timedOut = false;

//   // INIT
//   for (let slot of timeslots) {
//     for (let room of rooms) {
//       roomBusy[room.id + "_" + slot._id] = false;
//     }
//   }

//   for (let subject of subjects) {

//     for (let teacher of subject.teachers) {
//       for (let slot of timeslots) {
//         teacherBusy[teacher.id + "_" + slot._id] = false;
//       }
//     }

//     for (let section of subject.sections) {
//       for (let slot of timeslots) {
//         sectionBusy[section.id + "_" + slot._id] = false;
//       }
//       sectionGapUsed[section.id] = {};
//     }

//     subjectDayMap[subject._id] = new Set();
//   }

//   // QUEUE
//   let queue = [];

//   for (let subject of subjects) {
//     for (let i = 0; i < subject.weeklyFrequency; i++) {
//       queue.push(subject);
//     }
//   }

//   queue.sort(() => Math.random() - 0.5);

//   // =============================================
//   // ✅ BACKTRACKING FUNCTION — TEENO CASES HANDLE
//   // =============================================
//   function backtrack(queueIndex) {

//     // -----------------------------------------------
//     // 🟡 CASE 2: TIMEOUT CHECK
//     // "Shayad solution tha, par time mein nahi mila"
//     // -----------------------------------------------
//     if (Date.now() - startTime > TIME_LIMIT) {
//       timedOut = true;
//       return false;
//     }

//     // -----------------------------------------------
//     // 🟢 CASE 1: SUCCESS
//     // "Sab sessions schedule ho gaye — solution mil gaya"
//     // -----------------------------------------------
//     if (queueIndex === queue.length) return true;

//     let session = queue[queueIndex];

//     let totalStudents = session.sections.reduce((sum, sec) => {
//       return sum + sec.strength;
//     }, 0);

//     for (let i = 0; i < timeslots.length; i++) {

//       // 🟡 Har loop mein bhi time check karo — loop ke andar fasse nahi
//       if (Date.now() - startTime > TIME_LIMIT) {
//         timedOut = true;
//         return false;
//       }

//       let slot = timeslots[i];

//       if (subjectDayMap[session._id].has(slot.day)) continue;

//       // GAP TRY
//       for (let gap = 0; gap <= 2; gap++) {

//         let index = i + gap;
//         if (index >= timeslots.length) continue;

//         let trySlot = timeslots[index];

//         // GAP RULE (UNCHANGED)
//         let gapAllowed = session.sections.every(sec => {
//           if (gap === 0) return true;
//           return !sectionGapUsed[sec.id][trySlot.day];
//         });

//         if (!gapAllowed) continue;

//         // ROOM FILTER
//         let validRooms = rooms.filter(r =>
//   r.type === session.type
// );

//         validRooms.sort((a, b) => {
//           if (a.building === b.building && a.floor === b.floor) {
//             return a.capacity - b.capacity;
//           }
//           if (a.building === b.building) return -1;
//           return a.building.localeCompare(b.building);
//         });

//         let selectedRoom = null;

//         for (let room of validRooms) {
//           let key = room.id + "_" + trySlot._id;
//           if (!roomBusy[key] && room.capacity >= totalStudents) {
//             selectedRoom = room;
//             break;
//           }
//         }

//         if (!selectedRoom) continue;

//         let teacherFree = session.teachers.every(t =>
//           !teacherBusy[t.id + "_" + trySlot._id]
//         );

//         let sectionFree = session.sections.every(sec =>
//           !sectionBusy[sec.id + "_" + trySlot._id]
//         );

//         if (teacherFree && sectionFree) {

//           // ✅ ASSIGN
//           timetable.push({
//             subject: session._id,
//             teacher: session.teachers.map(t => t._id),
//             room: selectedRoom._id,
//             timeslot: trySlot._id,
//             sections: session.sections.map(s => s._id)
//           });

//           roomBusy[selectedRoom.id + "_" + trySlot._id] = true;

//           session.teachers.forEach(t => {
//             teacherBusy[t.id + "_" + trySlot._id] = true;
//           });

//           let gapSetFor = [];

//           session.sections.forEach(sec => {
//             sectionBusy[sec.id + "_" + trySlot._id] = true;
//             if (gap > 0 && !sectionGapUsed[sec.id][trySlot.day]) {
//               sectionGapUsed[sec.id][trySlot.day] = true;
//               gapSetFor.push(sec.id);
//             }
//           });

//           subjectDayMap[session._id].add(trySlot.day);

//           // RECURSE — agla session try karo
//           if (backtrack(queueIndex + 1)) return true;

//           // ↩️ BACKTRACK — UNDO
//           timetable.pop();

//           roomBusy[selectedRoom.id + "_" + trySlot._id] = false;

//           session.teachers.forEach(t => {
//             teacherBusy[t.id + "_" + trySlot._id] = false;
//           });

//           session.sections.forEach(sec => {
//             sectionBusy[sec.id + "_" + trySlot._id] = false;
//           });

//           gapSetFor.forEach(secId => {
//             delete sectionGapUsed[secId][trySlot.day];
//           });

//           subjectDayMap[session._id].delete(trySlot.day);
//         }
//       }
//     }

//     // -----------------------------------------------
//     // 🔴 CASE 3: REAL FAILURE
//     // "Is session ke liye koi bhi slot fit nahi hua"
//     // Ye actual error hai — solution exist nahi karta
//     // -----------------------------------------------
//     return false;
//   }

//   // =============================================
//   // ✅ BACKTRACKING CALL
//   // =============================================
//   let success = backtrack(0);

//   const timeTaken = Date.now() - startTime;

//   // =============================================
//   // ✅ TEENO CASES KA RESULT HANDLE KARO
//   // =============================================

//   // 🟢 CASE 1: SUCCESS — solution mil gaya
//   if (success) {
//     await Timetable.deleteMany({});
//     await Timetable.insertMany(timetable);

//     return {
//       status: "success",
//       message: "Timetable successfully generated",
//       timeTaken: timeTaken + "ms",
//       timetable,
//       failedSubjects: []
//     };
//   }

//   // 🟡 CASE 2: TIMEOUT — time limit hit
//   // "Shayad solution tha, par 2 seconds mein nahi mila"
//   if (timedOut) {
//     return {
//       status: "timeout",
//       message: "Timetable generation stopped — time limit (2s) reached. Solution may exist but could not be found in time. Try again.",
//       timeTaken: timeTaken + "ms",
//       timetable: [],
//       failedSubjects: []
//     };
//   }

//   // 🔴 CASE 3: REAL FAILURE — koi solution exist nahi karta
//   // "Poora search kar liya, kuch bhi fit nahi hua"
//   let failedSubjects = [];

//   for (let session of queue) {

//     let totalStudents = session.sections.reduce((sum, sec) => sum + sec.strength, 0);

//     let reason = "";

//     if (session.teachers.length === 0) {
//       reason = "No teacher assigned";
//     } else if (session.sections.length === 0) {
//       reason = "No section assigned";
//     } else {

//       let teacherIssue = false;
//       let roomIssue = false;

//       for (let slot of timeslots) {

//         let teacherFree = session.teachers.every(t =>
//           !teacherBusy[t.id + "_" + slot._id]
//         );

//         let roomAvailable = rooms.some(r =>
//           r.capacity >= totalStudents &&
//           !roomBusy[r.id + "_" + slot._id]
//         );

//         if (!teacherFree) teacherIssue = true;
//         if (!roomAvailable) roomIssue = true;
//       }

//       if (teacherIssue && roomIssue) {
//         reason = "Teacher + Room unavailable";
//       } else if (teacherIssue) {
//         reason = "Teacher busy all slots";
//       } else if (roomIssue) {
//         reason = "Room capacity / availability issue";
//       } else {
//         reason = "Gap limit / slot distribution issue";
//       }
//     }

//     failedSubjects.push({
//       subject: session.name,
//       requiredPerWeek: session.weeklyFrequency,
//       reason
//     });
//   }

//   await Timetable.deleteMany({});

//   return {
//     status: "failed",
//     message: "No valid timetable exists with current data. Please check teacher availability, room capacity, or reduce constraints.",
//     timeTaken: timeTaken + "ms",
//     timetable: [],
//     failedSubjects
//   };
// }

// module.exports = { generateTimetable };




// Phle ka Code
// const Subject = require("../models/Subject");
// const Room = require("../models/Room");
// const TimeSlot = require("../models/TimeSlot");
// const Timetable = require("../models/Timetable");

// async function generateTimetable() {

//   const subjects = await Subject.find()
//     .populate("teachers")
//     .populate("sections");

//   const rooms = await Room.find();
//   const timeslotsRaw = await TimeSlot.find();

//   // ✅ FIX: DAY ORDER + TIME SORT (MAIN BUG FIX)
//   const dayOrder = {
//     Monday: 1,
//     Tuesday: 2,
//     Wednesday: 3,
//     Thursday: 4,
//     Friday: 5,
//     Saturday: 6
//   };

//   const timeslots = timeslotsRaw.sort((a, b) => {
//     if (dayOrder[a.day] !== dayOrder[b.day]) {
//       return dayOrder[a.day] - dayOrder[b.day];
//     }
//     return a.startTime.localeCompare(b.startTime);
//   });

//   let timetable = [];

//   let teacherBusy = {};
//   let roomBusy = {};
//   let sectionBusy = {};
//   let subjectDayMap = {};
//   let sectionGapUsed = {};

//   let failedSubjects = [];

//   // INIT
//   for (let slot of timeslots) {
//     for (let room of rooms) {
//       roomBusy[room.id + "_" + slot._id] = false;
//     }
//   }

//   for (let subject of subjects) {

//     for (let teacher of subject.teachers) {
//       for (let slot of timeslots) {
//         teacherBusy[teacher.id + "_" + slot._id] = false;
//       }
//     }

//     for (let section of subject.sections) {
//       for (let slot of timeslots) {
//         sectionBusy[section.id + "_" + slot._id] = false;
//       }

//       sectionGapUsed[section.id] = {};
//     }

//     subjectDayMap[subject._id] = new Set();
//   }

//   // QUEUE
//   let queue = [];

//   for (let subject of subjects) {
//     for (let i = 0; i < subject.weeklyFrequency; i++) {
//       queue.push(subject);
//     }
//   }

//   queue.sort(() => Math.random() - 0.5);

//   // MAIN LOOP
//   for (let session of queue) {

//     let scheduled = false;

//     let totalStudents = session.sections.reduce((sum, sec) => {
//       return sum + sec.strength;
//     }, 0);

//     for (let i = 0; i < timeslots.length; i++) {

//       let slot = timeslots[i];

//       if (subjectDayMap[session._id].has(slot.day)) continue;

//       // 🔥 GAP TRY
//       for (let gap = 0; gap <= 2; gap++) {

//         let index = i + gap;
//         if (index >= timeslots.length) continue;

//         let trySlot = timeslots[index];

//         // 🔥 GAP RULE (UNCHANGED)
//         let gapAllowed = session.sections.every(sec => {
//           if (gap === 0) return true;
//           return !sectionGapUsed[sec.id][trySlot.day];
//         });

//         if (!gapAllowed) continue;

//         // ROOM FILTER
//         let validRooms = rooms.filter(r =>
//           r.type === (session.type === "lab" ? "lab" : "classroom")
//         );

//         validRooms.sort((a, b) => {
//           if (a.building === b.building && a.floor === b.floor) {
//             return a.capacity - b.capacity;
//           }
//           if (a.building === b.building) return -1;
//           return a.building.localeCompare(b.building);
//         });

//         let selectedRoom = null;

//         for (let room of validRooms) {
//           let key = room.id + "_" + trySlot._id;

//           if (!roomBusy[key] && room.capacity >= totalStudents) {
//             selectedRoom = room;
//             break;
//           }
//         }

//         if (!selectedRoom) continue;

//         let teacherFree = session.teachers.every(t =>
//           !teacherBusy[t.id + "_" + trySlot._id]
//         );

//         let sectionFree = session.sections.every(sec =>
//           !sectionBusy[sec.id + "_" + trySlot._id]
//         );

//         if (teacherFree && sectionFree) {

//           timetable.push({
//             subject: session._id,
//             teacher: session.teachers.map(t => t._id),
//             room: selectedRoom._id,
//             timeslot: trySlot._id,
//             sections: session.sections.map(s => s._id)
//           });

//           roomBusy[selectedRoom.id + "_" + trySlot._id] = true;

//           session.teachers.forEach(t => {
//             teacherBusy[t.id + "_" + trySlot._id] = true;
//           });

//           session.sections.forEach(sec => {
//             sectionBusy[sec.id + "_" + trySlot._id] = true;

//             if (gap > 0) {
//               sectionGapUsed[sec.id][trySlot.day] = true;
//             }
//           });

//           subjectDayMap[session._id].add(trySlot.day);

//           scheduled = true;
//           break;
//         }
//       }

//       if (scheduled) break;
//     }

//     // ❌ FAILURE (UNCHANGED)
//     if (!scheduled) {

//       let reason = "";

//       if (session.teachers.length === 0) {
//         reason = "No teacher assigned";
//       } else if (session.sections.length === 0) {
//         reason = "No section assigned";
//       } else {

//         let teacherIssue = false;
//         let roomIssue = false;

//         for (let slot of timeslots) {

//           let teacherFree = session.teachers.every(t =>
//             !teacherBusy[t.id + "_" + slot._id]
//           );

//           let roomAvailable = rooms.some(r =>
//             r.capacity >= totalStudents &&
//             !roomBusy[r.id + "_" + slot._id]
//           );

//           if (!teacherFree) teacherIssue = true;
//           if (!roomAvailable) roomIssue = true;
//         }

//         if (teacherIssue && roomIssue) {
//           reason = "Teacher + Room unavailable";
//         } else if (teacherIssue) {
//           reason = "Teacher busy all slots";
//         } else if (roomIssue) {
//           reason = "Room capacity / availability issue";
//         } else {
//           reason = "Gap limit / slot distribution issue";
//         }
//       }

//       failedSubjects.push({
//         subject: session.name,
//         requiredPerWeek: session.weeklyFrequency,
//         reason
//       });
//     }
//   }

//   await Timetable.deleteMany({});
//   await Timetable.insertMany(timetable);

//   return {
//     timetable,
//     failedSubjects
//   };
// }

// module.exports = { generateTimetable };


