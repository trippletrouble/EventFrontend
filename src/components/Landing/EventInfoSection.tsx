 
import React from 'react';
import { MapPin, Clock, Car } from 'lucide-react';

export function EventInfoSection() {
    return (
        <section id="event-info" aria-labelledby="event-info-heading" className="bg-surface py-16" data-navbar="dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Event details list */}
                    <div className="space-y-6">
                        <h2 id="event-info-heading" tabIndex={0} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight focus-ring rounded inline-block px-1">
                            Direkt an dem Campus<br />der Hochschule.
                        </h2>

                        <ul className="space-y-6" aria-label="Veranstaltungsdetails">
                            <li tabIndex={0} className="flex items-center gap-4 text-foreground p-1 focus-ring rounded">
                                <MapPin className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <span className="text-sm sm:text-base text-foreground/90 font-light">Alfons-Goppel-Platz 1, 95028 Hof</span>
                            </li>

                            <li tabIndex={0} className="flex items-center gap-4 text-foreground p-1 focus-ring rounded">
                                <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <span className="text-sm sm:text-base text-foreground/90 font-light">09:30 – 16:00 Uhr</span>
                            </li>

                            <li tabIndex={0} className="flex items-start gap-4 text-foreground p-1 focus-ring rounded">
                                <Car className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <span className="text-sm sm:text-base text-foreground/90 font-light leading-relaxed mt-0.5">
                  Aussteller Parkplatz P4 zwischen B-Gebäude und Gründerzentrum Einstein 1.
                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: Google Maps Embed */}
                    <div className="rounded-xl overflow-hidden shadow-xl border border-surface-border bg-surface-raised">
                        <iframe
                            title="Standort Hochschule Hof auf Google Maps"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2543.513524677727!2d11.9392233!3d50.3245465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a112cd1bb7a1df%3A0x6b4ef82df31c7cf3!2sHochschule+Hof!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
export default EventInfoSection;