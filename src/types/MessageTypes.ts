import { IconType } from "@/components/AppIcon/AppIcon";

export type MessageTypes = 'message' | 'announcement' | 'alert';
export type MessageConfigsType = Record<MessageTypes, {icon: IconType, color: Record<string, string>}>