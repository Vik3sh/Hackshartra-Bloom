import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { findEventById } from '@/lib/events';
import { MapPin, CalendarDays, Users, Trophy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams();
  const event = useMemo(() => findEventById(id), [id]);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredTime, setRegisteredTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'prizes' | 'faq'>('about');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeLeft = useMemo(() => {
    if (!event) return undefined;
    const diff = new Date(event.dateISO).getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [event, now]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col">

        {/* Hero Section */}
        <div className="relative w-full overflow-hidden z-10 rounded-none md:rounded-2xl">
          <img
            src="/assets/event-bg.png"
            alt="Event Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4 py-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              {event?.title}
            </h1>
            {event?.tagline && (
              <p className="text-sm md:text-lg text-white/80 mb-4">{event.tagline}</p>
            )}
            {/* Countdown */}
            <div className="grid grid-cols-4 gap-6">
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2 shadow-md">
                <div className="text-2xl font-bold">{timeLeft?.days ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">Days</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2 shadow-md">
                <div className="text-2xl font-bold">{timeLeft?.hours ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">Hours</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2 shadow-md">
                <div className="text-2xl font-bold">{timeLeft?.minutes ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">Minutes</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2 shadow-md">
                <div className="text-2xl font-bold">{timeLeft?.seconds ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlapping Card */}
        <Card
          id="event-details"
          className="relative z-20 -mt-16 shadow-lg ring-1 ring-indigo-100/60 border-0 bg-white/80 backdrop-blur-xl rounded-2xl mx-8 flex-shrink-0"
        >
          <CardHeader>
            <CardTitle className="sr-only">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {event ? (
              <div className="space-y-6">
                {/* Top info row */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center border-b pb-4">
                  <div className="md:col-span-2 flex items-center">
                    <div className="text-xl md:text-2xl font-semibold truncate">{event.title}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </div>
                    <div className="text-sm">{event.location}</div>
                    <a className="text-xs text-indigo-600 hover:underline" href="#">
                      View map
                    </a>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> Date
                    </div>
                    <div className="text-sm">{new Date(event.dateISO).toLocaleDateString()}</div>
                  </div>
                  <div className="md:col-span-1 flex justify-start md:justify-end gap-8 text-sm">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Users className="h-3 w-3" /> Registrants
                      </div>
                      <div className="font-medium tabular-nums">{event.stats?.registrants ?? 0}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Trophy className="h-3 w-3" /> Prize Pool
                      </div>
                      <div className="font-medium tabular-nums">
                        ₹{(event.stats?.prizePoolUSD ?? 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer + Register + Calendar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-3">
                    {event.organizer?.logoUrl && (
                      <img
                        src={event.organizer.logoUrl}
                        alt={event.organizer.name}
                        className="h-10 w-10 rounded-full object-contain"
                      />
                    )}
                    <div className="text-sm">
                      Organized by <span className="font-medium">{event.organizer?.name ?? '—'}</span>
                    </div>
                  </div>
                  <div />
                  <div className="flex md:justify-end gap-4">
                    {/* Register Button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Button
                              className={`px-10 py-4 text-sm font-medium shadow-md rounded-full transition will-change-transform ${isRegistered
                                ? 'bg-emerald-600 hover:bg-emerald-600 cursor-default'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                                }`}
                              onClick={() => {
                                if (!event || isRegistered) return;

                                setIsRegistered(true);

                                const registeredAt = new Date();
                                const options: Intl.DateTimeFormatOptions = {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                };
                                const formattedTime = registeredAt.toLocaleString('en-IN', options);
                                setRegisteredTime(formattedTime);

                                toast({
                                  title: 'Registration successful 🎉',
                                  description: `You registered for ${event.title} on ${formattedTime}.`,
                                  duration: 1000,
                                });
                              }}
                              aria-disabled={isRegistered}
                              disabled={isRegistered}
                            >
                              {isRegistered ? (
                                <span className="inline-flex items-center gap-2">
                                  <Check className="h-4 w-4" /> Registered
                                </span>
                              ) : (
                                'REGISTER NOW'
                              )}
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isRegistered && registeredTime ? (
                            <p className="text-xs text-emerald-600">
                              ✅ You registered on {registeredTime}
                            </p>
                          ) : (
                            <p className="text-xs">Registration fee ₹{event.fee ?? 0}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Google Calendar Button */}
                    {event && (
                      <Button
                        variant="outline"
                        className="px-6 py-4 text-sm font-medium shadow-md rounded-full"
                        onClick={() => {
                          const start = new Date(event.dateISO).toISOString().replace(/-|:|\.\d+/g, '');
                          const end = new Date(new Date(event.dateISO).getTime() + 2 * 60 * 60 * 1000)
                            .toISOString()
                            .replace(/-|:|\.\d+/g, '');
                          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                            event.title
                          )}&dates=${start}/${end}&details=${encodeURIComponent(
                            event.description
                          )}&location=${encodeURIComponent(event.location)}`;
                          window.open(url, '_blank');
                        }}
                      >
                        Add to Google Calendar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div>
                  <div className="flex gap-4 border-b">
                    <button
                      onClick={() => setActiveTab('about')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'about'
                        ? 'border-indigo-600 text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActiveTab('prizes')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'prizes'
                        ? 'border-indigo-600 text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      Prizes
                    </button>
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'faq'
                        ? 'border-indigo-600 text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      FAQ
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none pt-4">
                    {activeTab === 'about' && <p>{event.description}</p>}
                    {activeTab === 'prizes' && (
                      <ul>
                        <li>Total prize pool: ₹{(event.stats?.prizePoolUSD ?? 0).toLocaleString('en-IN')}</li>
                        <li>Awards: Best Innovation, Best Design, Community Impact</li>
                        <li>Swags and goodies for finalists</li>
                      </ul>
                    )}
                    {activeTab === 'faq' && (
                      <ul>
                        <li><strong>Who can participate?</strong> Students and professionals.</li>
                        <li><strong>Team size?</strong> Up to 4 members.</li>
                        <li><strong>What to bring?</strong> Laptop, valid ID.</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Event not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetailsPage;
