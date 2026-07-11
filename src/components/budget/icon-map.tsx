import {
  BookOpen,
  Bus,
  Gamepad2,
  HeartPulse,
  Home,
  MoreHorizontal,
  Plane,
  ShoppingBag,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  bus: Bus,
  plane: Plane,
  "gamepad-2": Gamepad2,
  home: Home,
  "book-open": BookOpen,
  zap: Zap,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  "more-horizontal": MoreHorizontal,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? MoreHorizontal;
}
