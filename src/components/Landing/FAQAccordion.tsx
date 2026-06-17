'use client';

import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';

interface AccordionItem {
    value: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
    return (
        <RadixAccordion.Root type="single" collapsible className={className}>
            {items.map((item) => (
                <RadixAccordion.Item
                    key={item.value}
                    value={item.value}
                    className="border-b border-surface-border/40"
                >
                    <RadixAccordion.Header asChild>
                        <h4 className="m-0">
                            <RadixAccordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-base font-semibold text-foreground/90 hover:text-primary transition-colors focus-ring rounded-lg px-2">
                                {item.trigger}
                                <Plus key="plus-icon" className="w-6 h-6 text-foreground-muted transition-transform group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary shrink-0" aria-hidden="true" />
                            </RadixAccordion.Trigger>
                        </h4>
                    </RadixAccordion.Header>

                    <RadixAccordion.Content className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:max-h-0 data-[state=open]:max-h-[500px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
                        <div className="pb-6 px-2 text-sm text-foreground-muted leading-relaxed">
                            {item.content}
                        </div>
                    </RadixAccordion.Content>
                </RadixAccordion.Item>
            ))}
        </RadixAccordion.Root>
    );
}