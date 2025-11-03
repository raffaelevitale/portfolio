import { Lesson } from '@/lib/orario/models/lesson';

interface ClassScheduleData {
  metadata: {
    extracted_at: string;
    source: string;
    type: string;
    totalClasses: number;
  };
  schedule: {
    [className: string]: Array<{
      class: string;
      subject: string;
      teacher: string;
      classroom: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      color: string;
    }>;
  };
}

interface TeacherScheduleData {
  metadata: {
    extracted_at: string;
    source: string;
    type: string;
    totalTeachers: number;
  };
  schedule: {
    [teacherName: string]: {
      docente: string;
      materie: string[];
      orario: {
        [day: string]: Array<{
          ora: string;
          slot: number;
          classe: string;
          materia: string;
          aula: string;
          color: string;
        }>;
      };
      totaleLezioni: number;
    };
  };
}

export async function loadClassNames(): Promise<string[]> {
  try {
    const response = await fetch('/orario/orario_studenti.json');
    const data: ClassScheduleData = await response.json();
    return Object.keys(data.schedule).sort();
  } catch (error) {
    console.error('Error loading class names:', error);
    return [];
  }
}

export async function loadTeacherNames(): Promise<string[]> {
  try {
    const response = await fetch('/orario/orario_docenti.json');
    const data: TeacherScheduleData = await response.json();
    return Object.keys(data.schedule).sort();
  } catch (error) {
    console.error('Error loading teacher names:', error);
    return [];
  }
}

function normalizeSubject(subject: string): string {
  const map: Record<string, string> = {
    'Lingua inglese': 'Inglese',
    'Lingua Italiana': 'Italiano',
    'Scienze motorie e sportive': 'Scienze motorie',
    'Scienze Motorie e Sportive': 'Scienze motorie',
  };
  return map[subject] ?? subject;
}

export async function loadClassSchedule(className: string): Promise<Lesson[]> {
  try {
    const response = await fetch('/orario/orario_studenti.json');
    const data: ClassScheduleData = await response.json();
    const lessons = data.schedule[className];

    if (!lessons) return [];

    return lessons
      .map((lesson, index) => ({
        id: `${lesson.class}-${lesson.dayOfWeek}-${index}`,
        subject: lesson.subject === 'INTERVALLO' ? 'Intervallo' : normalizeSubject(lesson.subject),
        teacher: lesson.subject === 'INTERVALLO' ? '' : lesson.teacher,
        classroom: lesson.subject === 'INTERVALLO' ? 'Corridoio / Bar' : lesson.classroom,
        dayOfWeek: lesson.dayOfWeek,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        color: lesson.subject === 'INTERVALLO' ? '#bdbdbd' : lesson.color,
        isBreak: lesson.subject === 'INTERVALLO',
      }));
  } catch (error) {
    console.error('Error loading class schedule:', error);
    return [];
  }
}

const dayMap: { [key: string]: number } = {
  Lunedì: 1,
  Martedì: 2,
  Mercoledì: 3,
  Giovedì: 4,
  Venerdì: 5,
  Sabato: 6,
};

export async function loadTeacherSchedule(teacherName: string): Promise<Lesson[]> {
  try {
    const response = await fetch('/orario/orario_docenti.json');
    const data: TeacherScheduleData = await response.json();
    const teacher = data.schedule[teacherName];

    if (!teacher) return [];

    const lessons: Lesson[] = [];

    Object.entries(teacher.orario).forEach(([dayName, dayLessons]) => {
      const dayOfWeek = dayMap[dayName];
      if (!dayOfWeek) return;

      dayLessons.forEach((lesson, index) => {
        if (!lesson.materia || lesson.materia.trim() === '') return;

        const [startTime, endTime] = lesson.ora.split('-');
        lessons.push({
          id: `${teacher.docente}-${dayOfWeek}-${index}`,
          subject: lesson.materia,
          teacher: teacher.docente,
          classroom: lesson.aula,
          dayOfWeek: dayOfWeek,
          startTime: startTime,
          endTime: endTime,
          color: lesson.color,
          isBreak: false,
        });
      });
    });

    return lessons.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });
  } catch (error) {
    console.error('Error loading teacher schedule:', error);
    return [];
  }
}
