export type DashboardUser = {
  id: string;
  name: string;
  username: string;
};

export type Progress = {
  lessonIndex: number;
  progress: number;
  practiceToday: number;
  practiceTotal: number;
};