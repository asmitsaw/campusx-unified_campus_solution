import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const courses = [
  {
    id: 1,
    title: 'Advanced Machine Learning',
    instructor: 'Dr. Alan Turing',
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    thumbnail: 'bg-indigo-500',
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    instructor: 'Prof. Tim Berners-Lee',
    progress: 30,
    totalModules: 20,
    completedModules: 6,
    thumbnail: 'bg-emerald-500',
  },
  {
    id: 3,
    title: 'Data Structures with C++',
    instructor: 'Dr. Grace Hopper',
    progress: 100,
    totalModules: 15,
    completedModules: 15,
    thumbnail: 'bg-purple-500',
  },
];

export default function LMS() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Learning Portal</h1>
        <p className="text-gray-500 mt-2">Continue your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className={`h-40 ${course.thumbnail} relative`}>
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <PlayCircle className="text-white w-16 h-16" />
                 </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">by {course.instructor}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{course.progress}% Complete</span>
                    <span className="text-gray-500">{course.completedModules}/{course.totalModules} Modules</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${course.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </div>
                  
                  <div className="pt-2">
                    {course.progress === 100 ? (
                      <Button className="w-full bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                        <CheckCircle size={16} className="mr-2" />
                        Completed
                      </Button>
                    ) : (
                      <Button className="w-full">Continue Learning</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
