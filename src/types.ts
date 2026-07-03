export interface Task {
  id: string;
  title: string;
  budget: number;
  location: string;
  deadline: string;
  xp: number;
  category: 'Delivery' | 'Home' | 'Pet' | 'Moving';
}
