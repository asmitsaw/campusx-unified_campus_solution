import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const jobs = [
  {
    id: 1,
    role: 'Software Engineer Intern',
    company: 'Google',
    location: 'Bangalore, India',
    salary: '₹12 LPA',
    type: 'Full-time',
    tags: ['React', 'Python', 'Cloud'],
    status: 'Applied',
    posted: '2 days ago',
  },
  {
    id: 2,
    role: 'Product Designer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: '₹18 LPA',
    type: 'Full-time',
    tags: ['Figma', 'UX/UI', 'Prototyping'],
    status: 'Open',
    posted: '1 week ago',
  },
  {
    id: 3,
    role: 'Data Analyst',
    company: 'Amazon',
    location: 'Remote',
    salary: '₹15 LPA',
    type: 'Internship',
    tags: ['SQL', 'Tableau', 'Python'],
    status: 'Rejected',
    posted: '3 days ago',
  },
];

export default function Placement() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Placement Portal</h1>
          <p className="text-gray-500 mt-2">Explore opportunities and track your applications.</p>
        </div>
        <Button>Upload Resume</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-indigo-100 mb-1">Total Applications</div>
            <div className="text-4xl font-bold">12</div>
            <div className="mt-4 text-sm text-indigo-200 bg-white/10 w-fit px-2 py-1 rounded">
              +2 this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500 mb-1">Interviews Scheduled</div>
            <div className="text-4xl font-bold text-gray-900">3</div>
            <div className="mt-4 text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
              Next: Tomorrow, 2 PM
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-gray-500 mb-1">Offers Received</div>
            <div className="text-4xl font-bold text-gray-900">1</div>
            <div className="mt-4 text-sm text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded">
              Action Required
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Recommended Jobs</h2>
      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600">
                      {job.company[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.role}</h3>
                      <p className="text-gray-500 font-medium">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} /> {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} /> {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} /> {job.type}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {job.tags.map(tag => (
                          <Badge key={tag} variant="neutral">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {job.status === 'Applied' && <Badge variant="primary">Applied</Badge>}
                    {job.status === 'Open' && <Button size="sm">Apply Now</Button>}
                    {job.status === 'Rejected' && <Badge variant="danger">Not Selected</Badge>}
                    <span className="text-xs text-gray-400">{job.posted}</span>
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
