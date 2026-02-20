import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Clock, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function Faculty() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your classes, students, and schedules.</p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800">
            <Plus size={18} className="mr-2" />
            Create New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <h3 className="text-2xl font-bold">1,204</h3>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                    <BookOpen size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Active Courses</p>
                    <h3 className="text-2xl font-bold">8</h3>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Hours Taught</p>
                    <h3 className="text-2xl font-bold">32</h3>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-lg text-gray-600">
                                    <span className="text-xs font-bold uppercase">Oct</span>
                                    <span className="text-xl font-bold">24</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Advanced Algorithms</h3>
                                    <p className="text-sm text-gray-500">Room 304 • 10:00 AM - 11:30 AM</p>
                                </div>
                            </div>
                            <Badge variant="primary">Upcoming</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                        JS
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">John Smith</h4>
                                        <p className="text-xs text-gray-500">submitted Assignment 3</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">2h ago</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
