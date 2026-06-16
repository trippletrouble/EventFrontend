import React from 'react';
import { Accordion } from '@/components/Landing/FAQAccordion';


interface FAQItemData {
    question: string;
    answer: string;
}

interface FAQCategory {
    title: string;
    items: FAQItemData[];
}

const FAQ_DATA: FAQCategory[] = [
    {
        title: 'Studierende',
        items: [
            {
                question: 'Wann und wo findet die Unternehmerbörse 2026 statt?',
                answer: 'Die Unternehmerbörse 2026 findet am 12. Mai 2026 von 09:30 bis 16:00 Uhr auf dem Campus der Hochschule Hof statt (Alfons-Goppel-Platz 1, 95028 Hof).',
            },
            {
                question: 'Findet die Messe online oder in Präsenz statt?',
                answer: 'Die Unternehmerbörse findet ausschließlich in Präsenz auf dem Campus der Hochschule Hof statt.',
            },
            {
                question: 'Welche Unternehmen stellen auf der Unternehmerbörse 2026 aus?',
                answer: 'Über 80 Unternehmen aus verschiedenen Branchen wie IT, Maschinenbau, Wirtschaft und Logistik. Die vollständige Ausstellerliste findest du auf unserer Website.',
            },
            {
                question: 'Kostet mich der Besuch der Messe etwas?',
                answer: 'Nein, der Besuch der Unternehmerbörse ist für Studierende und Besucher kostenlos.',
            },
            {
                question: 'Was erwartet mich auf der Unternehmerbörse 2026?',
                answer: 'Messestände von über 80 Unternehmen, direkter Kontakt zu Personalverantwortlichen, CV-Checks durch den Career Service und vielem mehr.',
            },
            {
                question: 'Wie finde ich den Standplatz eines Unternehmens?',
                answer: 'Nutze die Messe-App oder den Raumplan vor Ort, um den Standplatz deines Wunschunternehmens zu finden.',
            },
            {
                question: 'Ich habe weitere Fragen. Wen kann ich kontaktieren?',
                answer: 'Schreibe uns eine E-Mail an info@events.hof-university.de oder rufe an unter 09281 / 409 - 3035 / 3009.',
            },
        ],
    },
    {
        title: 'Aussteller',
        items: [
            {
                question: 'Welche Zielgruppe ist auf der Unternehmerbörse 2026 zu finden?',
                answer: 'Studierende und Absolventen der Hochschule Hof aus allen Fachrichtungen sowie Studierende benachbarter Hochschulen.',
            },
            {
                question: 'Wie kann ich mein Unternehmen als Aussteller anmelden?',
                answer: 'Registrieren Sie sich auf unserer Plattform und wählen Sie ein passendes Ausstellerpaket aus.',
            },
            {
                question: 'Wann startet und endet der Anmeldezeitraum für die Unternehmerbörse 2026?',
                answer: 'Der Anmeldezeitraum wird rechtzeitig auf unserer Website bekanntgegeben. Frühzeitige Anmeldung wird empfohlen.',
            },
            {
                question: 'Welche Kosten erwarten mein Unternehmen als Aussteller?',
                answer: 'Die Kosten variieren je nach Paket. Details finden Sie auf unserer Tickets-Seite.',
            },
            {
                question: 'Welche Werbemöglichkeiten stehen mir als Aussteller zur Verfügung?',
                answer: 'Je nach Paket: Ausstellerprofil auf der Website, Anzeigen in der Messe-App, Logo-Platzierung und mehr.',
            },
            {
                question: 'Wo kann ich meine Rechnungsanschrift hinterlegen?',
                answer: 'Im Dashboard unter "Profil bearbeiten" können Sie Ihre Rechnungsanschrift jederzeit anpassen.',
            },
            {
                question: 'Wann und wie erhalte ich als ausstellendes Unternehmen die Rechnung?',
                answer: 'Die Rechnung wird nach erfolgreicher Buchung automatisch per E-Mail zugestellt.',
            },
            {
                question: 'Wo kann ich mein Ausstellerprofil befüllen und bearbeiten?',
                answer: 'Nach der Registrierung können Sie Ihr Profil im Dashboard bearbeiten.',
            },
            {
                question: 'Wie bleibe ich auf dem Laufenden?',
                answer: 'Besuchen Sie regelmäßig unsere Website oder kontaktieren Sie uns direkt per E-Mail.',
            },
        ],
    },
];


export function FAQSection() {
    return (
        <section aria-labelledby="faq-heading" className="bg-surface py-16" data-navbar="dark">
            <div className="max-w-3xl mx-auto px-4">
                <h2 id="faq-heading" tabIndex={0} className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 tracking-tight focus-ring rounded inline-block px-2">
                    Häufige Fragen?
                </h2>

                {FAQ_DATA.map((category) => (
                    <div key={category.title} className="mb-12 last:mb-6">
                        <h3 tabIndex={0} className="text-2xl font-bold text-foreground mb-6 focus-ring rounded inline-block px-1">
                            {category.title}
                        </h3>

                        <Accordion
                            className="w-full"
                            items={category.items.map((item, i) => ({
                                value: `faq-${category.title.toLowerCase()}-${i}`,
                                trigger: <span>{item.question}</span>,
                                content: <p>{item.answer}</p>
                            }))}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FAQSection;