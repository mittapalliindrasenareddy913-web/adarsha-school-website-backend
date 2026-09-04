import dotenv from 'dotenv';
import mongoose from 'mongoose';

import SiteSettings from '../models/SiteSettings.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Media from '../models/Media.js';
import Gallery from '../models/Gallery.js';
import Faculty from '../models/Faculty.js';
import Achievement from '../models/Achievement.js';
import Facility from '../models/Facility.js';
import Academic from '../models/Academic.js';

dotenv.config();

export async function seedInitialData() {
  try {
    // 1. Site Settings
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create({
        heroImage: "",
        leadershipPhoto: "",
        logo: ""
      });
      console.log('[Seed] SiteSettings initialized.');
    }

    // 2. Announcements
    const announcementsCount = await Announcement.countDocuments();
    if (announcementsCount === 0) {
      await Announcement.create([
        {
          title: "Admissions Open for Academic Session 2026–2027",
          slug: "admissions-open-2026-2027",
          category: "Admissions",
          priority: "High",
          dateFormatted: "August 15, 2026",
          shortDescription: "Application forms for foundational, primary, middle, and secondary grades are now available at the school office.",
          fullDescription: "Adarsha E.M. School announces the commencement of admissions for the upcoming academic year 2026–2027. Parents seeking quality English medium education with a balanced emphasis on academics, moral values, and co-curricular development are invited to visit the school campus or submit an online enquiry.",
          status: "published",
          showPopup: true
        },
        {
          title: "Second Quarter Parent-Teacher Interactive Session",
          slug: "parent-teacher-meeting-q2",
          category: "Important Notice",
          priority: "Medium",
          dateFormatted: "September 2, 2026",
          shortDescription: "Scheduled interaction meeting for parents to review student academic evaluation reports and discuss progress.",
          fullDescription: "The quarterly Parent-Teacher Interaction meeting will take place on Saturday, September 10, 2026, from 9:00 AM to 1:00 PM.",
          status: "published"
        }
      ]);
      console.log('[Seed] Announcements initialized.');
    }

    // 3. Events
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      await Event.create([
        {
          name: "Annual Cultural Day & Prize Distribution 2026",
          slug: "annual-day-2026",
          category: "Annual Day",
          date: new Date("2026-11-20"),
          dateFormatted: "November 20, 2026",
          time: "5:00 PM – 8:30 PM",
          location: "Main Auditorium / Campus Grounds",
          coverImage: "",
          shortDescription: "A grand evening celebrating student academic distinctions, cultural music performances, and theatrical stage plays.",
          description: "Join us for our flagship event of the year! The Annual Cultural Day brings together students, faculty, and parents to celebrate achievements in academics, sports, and co-curricular fields.",
          status: "published",
          photos: [],
          videos: [
            { title: "Annual Day Highlights", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", source: "youtube" }
          ]
        }
      ]);
      console.log('[Seed] Events initialized.');
    }

    // 4. Media - default empty
    // 5. Faculty
    const facultyCount = await Faculty.countDocuments();
    if (facultyCount === 0) {
      await Faculty.create([
        {
          name: "Faculty Member 01",
          designation: "Senior Mathematics Educator",
          qualification: "M.Sc. Mathematics, B.Ed.",
          subject: "Mathematics",
          photo: "",
          bio: "Dedicated mathematics teacher focused on making logical concepts accessible.",
          status: "published"
        }
      ]);
      console.log('[Seed] Faculty initialized.');
    }

    // 6. Achievements
    const achievementsCount = await Achievement.countDocuments();
    if (achievementsCount === 0) {
      await Achievement.create([
        {
          title: "Board Examination Excellence Distinction",
          category: "Academic Excellence",
          year: "2024–2025",
          description: "Consistent academic performance with high scoring pass rate in secondary board examinations.",
          image: "",
          status: "published"
        }
      ]);
      console.log('[Seed] Achievements initialized.');
    }

    // 7. Facilities
    const facilitiesCount = await Facility.countDocuments();
    if (facilitiesCount === 0) {
      await Facility.create([
        {
          title: "Smart Classrooms",
          description: "Ventilated learning spaces equipped with audio-visual display systems.",
          imageKey: "",
          image: "",
          icon: "Tv",
          features: ["Interactive AV Systems", "Ergonomic Student Seating"],
          status: "published"
        },
        {
          title: "Science Laboratories",
          description: "Physics, chemistry, and biology laboratory equipment.",
          imageKey: "",
          image: "",
          icon: "FlaskConical",
          features: ["Microscopes & Apparatus", "Supervised Workstations"],
          status: "published"
        }
      ]);
      console.log('[Seed] Facilities initialized.');
    }

    // 8. Academics
    const academicCount = await Academic.countDocuments();
    if (academicCount === 0) {
      await Academic.create([
        {
          id: "primary",
          title: "Primary Education",
          grades: "Foundational Level",
          description: "Focuses on foundational literacy, basic numeracy, active curiosity, and art expression.",
          highlights: ["Activity-Based Learning", "Language Skills"],
          imageKey: "",
          image: "",
          status: "published"
        },
        {
          id: "middle",
          title: "Middle School",
          grades: "Preparatory Level",
          description: "Transitions towards structured subject specialization, scientific inquiry, and logic.",
          highlights: ["Mathematics & Science", "Social Studies"],
          imageKey: "",
          image: "",
          status: "published"
        },
        {
          id: "secondary",
          title: "Secondary Education",
          grades: "High School Level",
          description: "Comprehensive secondary curriculum alignment, analytical problem-solving, and exam preparation.",
          highlights: ["Board Alignment", "Science & Math Labs"],
          imageKey: "",
          image: "",
          status: "published"
        }
      ]);
      console.log('[Seed] Academics initialized.');
    }

  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
}
