import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Globe, Calendar, MapPin } from "lucide-react";
import API from "../../api/adminAPI";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  image: string;
  isPublished: boolean;
}

const PublishedEvents = () => {
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("adminToken")}` };
        // Fetch all events
        const response = await API.get('/admin/events', { headers });
        const allEvents = response.data.data || [];
        
        // Filter strictly for published events
        const activeEvents = allEvents.filter((event: Event) => event.isPublished === true);
        setPublishedEvents(activeEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Published Events</h2>
          <p className="text-sm text-gray-500 mt-1">These events are currently live and visible to users.</p>
        </div>
      </div>

      {publishedEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Published Events</h3>
          <p className="text-gray-500 text-sm mt-1">Publish an event from the Manage Events page to see it here.</p>
          <button 
            onClick={() => navigate('/admin/manage-events')}
            className="mt-4 text-blue-600 font-medium hover:underline text-sm"
          >
            Go to Manage Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedEvents.map(event => (
            <div 
              key={event.id} 
              onClick={() => navigate(`/admin/events/${event.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  LIVE
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="line-clamp-1">{event.venue}, {event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedEvents;