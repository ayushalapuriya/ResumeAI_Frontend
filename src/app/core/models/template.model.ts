export interface Template {
  templateId: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  htmlLayout: string;
  cssStyles: string;
  category: string;
  isPremium: boolean;
  isActive: boolean;
  usageCount: number;
  createdAt: string; 
}