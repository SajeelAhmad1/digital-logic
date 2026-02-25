// lib/courses.ts
// Hardcoded for now — replace with DB calls later

export type Lesson = {
  id: string;
  title: string;
  duration: string; // e.g. "3 min"
  content: string;  // HTML string
  starterCode: string;
  language: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  hasCertificate: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hours: number;
  lessons: Lesson[];
};

export const COURSES: Course[] = [
  {
    id: 'intro-to-java',
    title: 'Intro to Java',
    description:
      'Get started with Java by learning about the basics of a Java program and variables!',
    isFree: true,
    hasCertificate: false,
    difficulty: 'Beginner',
    hours: 6,
    lessons: [
      {
        id: 'hello-world',
        title: 'Hello World',
        duration: '3 min',
        content: `
          <p class="lesson-label">HELLO WORLD</p>
          <h2>Introduction to Java</h2>
          <p>Welcome to the world of Java programming!</p>
          <p>Programming languages enable humans to write instructions that a computer can perform. With precise instructions, computers coordinate applications and systems that run the modern world.</p>
          <p><a href="https://www.sun.com" target="_blank" rel="noreferrer" class="lesson-link">Sun Microsystems</a> released the Java programming language in 1995. Java is known for being simple, portable, secure, and robust.</p>
          <p>One reason people love Java is the Java Virtual Machine, which ensures the same Java code can be run on different operating systems and platforms.</p>
          <div class="lesson-diagram">
            <p class="diagram-title">Java Program</p>
            <pre>class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}</pre>
            <p class="diagram-label">HelloWorld.java → <strong>Compiler</strong></p>
          </div>
        `,
        starterCode: `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`,
        language: 'java',
      },
      {
        id: 'variables',
        title: 'Variables',
        duration: '5 min',
        content: `
          <p class="lesson-label">VARIABLES</p>
          <h2>Storing Data in Java</h2>
          <p>Variables are containers for storing data values. In Java, every variable must be declared with a type.</p>
          <p>Java has several primitive data types including <code>int</code>, <code>double</code>, <code>boolean</code>, and <code>char</code>.</p>
        `,
        starterCode: `public class Variables {
  public static void main(String[] args) {
    int age = 25;
    String name = "Alice";
    System.out.println(name + " is " + age + " years old.");
  }
}`,
        language: 'java',
      },
    ],
  },
  {
    id: 'learn-python-3',
    title: 'Learn Python 3',
    description:
      'Learn the basics of Python 3.12, one of the most powerful, versatile, and in-demand programming languages today.',
    isFree: false,
    hasCertificate: true,
    difficulty: 'Beginner',
    hours: 24,
    lessons: [
      {
        id: 'hello-python',
        title: 'Hello World',
        duration: '2 min',
        content: `
          <p class="lesson-label">HELLO WORLD</p>
          <h2>Introduction to Python</h2>
          <p>Python is a high-level, general-purpose programming language known for its readability and simplicity.</p>
          <p>Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.</p>
        `,
        starterCode: `print("Hello, World!")`,
        language: 'python',
      },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}