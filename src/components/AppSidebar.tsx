import { useState } from 'react';
import { Feather, Brain, Activity, Users, Download, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { id: 'compose', title: 'Scene Composer', icon: Feather },
  { id: 'feedback', title: 'AI Feedback', icon: Brain },
  { id: 'emotions', title: 'Emotion Tracker', icon: Activity },
  { id: 'characters', title: 'Memory System', icon: Users },
  { id: 'export', title: 'Export Tools', icon: Download },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>
            Studio Tools
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    className={`cursor-pointer ${
                      activeSection === item.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}