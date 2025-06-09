import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Profile Information</CardTitle>
          <CardDescription>Update your personal details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>FL</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Picture</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Flow User" className="bg-background" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="user@example.com" disabled className="bg-background"/>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Profile</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Security</CardTitle>
          <CardDescription>Manage your password and two-factor authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" className="bg-background"/>
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" className="bg-background"/>
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" className="bg-background"/>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Change Password</Button>
          <Separator className="my-6" />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Switch id="2fa-switch" />
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
          <CardDescription>Configure your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive summaries and alerts via email.</p>
            </div>
            <Switch id="email-notifications" defaultChecked/>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Get real-time alerts on your devices (coming soon).</p>
            </div>
            <Switch id="push-notifications" disabled/>
          </div>
           <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Budget Alerts</h4>
              <p className="text-sm text-muted-foreground">Notify me when I'm close to exceeding a budget.</p>
            </div>
            <Switch id="budget-alerts" defaultChecked/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
