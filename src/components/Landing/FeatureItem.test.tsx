'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FeatureItem } from './FeatureItem';

expect.extend(toHaveNoViolations);

const defaultProps = {
    icon: <svg data-testid="test-icon" />,
    title: 'Test Titel',
    description: 'Test Beschreibung für das Feature.',
};

describe('FeatureItem-Komponente', () => {
    describe('Barrierefreiheit (A11y)', () => {
        it('hat keine Barrierefreiheitsverletzungen im Dark-Theme', async () => {
            const { container } = render(<FeatureItem {...defaultProps} theme="dark" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('hat keine Barrierefreiheitsverletzungen im Light-Theme', async () => {
            const { container } = render(<FeatureItem {...defaultProps} theme="light" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Initiales Rendering', () => {
        it('rendert den Titel korrekt', () => {
            render(<FeatureItem {...defaultProps} />);
            expect(screen.getByText('Test Titel')).toBeInTheDocument();
        });

        it('rendert die Beschreibung korrekt', () => {
            render(<FeatureItem {...defaultProps} />);
            expect(screen.getByText('Test Beschreibung für das Feature.')).toBeInTheDocument();
        });

        it('rendert das Icon innerhalb eines aria-hidden Containers', () => {
            render(<FeatureItem {...defaultProps} />);
            const icon = screen.getByTestId('test-icon');
            const iconContainer = icon.closest('[aria-hidden="true"]');
            expect(iconContainer).toBeInTheDocument();
        });

        it('rendert den Titel als h4-Element', () => {
            const { container } = render(<FeatureItem {...defaultProps} />);
            const h4 = container.querySelector('h4');
            expect(h4).toBeInTheDocument();
            expect(h4).toHaveTextContent('Test Titel');
        });
    });

    describe('Theme-Varianten', () => {
        it('wendet die Light-Theme-Klassen auf den Titel an', () => {
            const { container } = render(<FeatureItem {...defaultProps} theme="light" />);
            const h4 = container.querySelector('h4');
            expect(h4).toHaveClass('text-slate-900');
        });

        it('wendet die Dark-Theme-Klassen auf den Titel an', () => {
            const { container } = render(<FeatureItem {...defaultProps} theme="dark" />);
            const h4 = container.querySelector('h4');
            expect(h4).toHaveClass('text-foreground');
        });

        it('wendet die Light-Theme-Klassen auf die Beschreibung an', () => {
            render(<FeatureItem {...defaultProps} theme="light" />);
            const description = screen.getByText(defaultProps.description);
            expect(description).toHaveClass('text-black');
        });

        it('wendet die Dark-Theme-Klassen auf die Beschreibung an', () => {
            render(<FeatureItem {...defaultProps} theme="dark" />);
            const description = screen.getByText(defaultProps.description);
            expect(description).toHaveClass('text-foreground-muted');
        });

        it('verwendet Dark als Standard-Theme', () => {
            const { container } = render(<FeatureItem {...defaultProps} />);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.className).toContain('hover:bg-surface-raised/30');
        });

        it('wendet den Light-Theme Hover-Stil an', () => {
            const { container } = render(<FeatureItem {...defaultProps} theme="light" />);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.className).toContain('hover:bg-slate-50');
        });
    });

    describe('Props und Styling', () => {
        it('wendet die übergebene iconColor-Klasse an', () => {
            render(<FeatureItem {...defaultProps} iconColor="text-[#2860F9]" />);
            const iconContainer = screen.getByTestId('test-icon').closest('div');
            expect(iconContainer).toHaveClass('text-[#2860F9]');
        });

        it('wendet die übergebene borderColorClass an', () => {
            render(<FeatureItem {...defaultProps} borderColorClass="border-[#FE3D4E]" />);
            const iconContainer = screen.getByTestId('test-icon').closest('div');
            expect(iconContainer).toHaveClass('border-[#FE3D4E]');
        });

        it('verwendet border-transparent als Standard wenn keine borderColorClass übergeben wird', () => {
            render(<FeatureItem {...defaultProps} />);
            const iconContainer = screen.getByTestId('test-icon').closest('div');
            expect(iconContainer).toHaveClass('border-transparent');
        });

        it('verwendet text-primary als Standard-Icon-Farbe', () => {
            render(<FeatureItem {...defaultProps} />);
            const iconContainer = screen.getByTestId('test-icon').closest('div');
            expect(iconContainer).toHaveClass('text-primary');
        });

        it('wendet eine zusätzliche className auf den Wrapper an', () => {
            const { container } = render(<FeatureItem {...defaultProps} className="custom-class" />);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper).toHaveClass('custom-class');
        });
    });

    describe('Tastaturbedienung und Fokus', () => {
        it('erlaubt das Fokussieren des FeatureItems über tabIndex', () => {
            const { container } = render(<FeatureItem {...defaultProps} />);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper).toHaveAttribute('tabindex', '0');
        });

        it('erhält den Fokus beim direkten Fokussieren', () => {
            const { container } = render(<FeatureItem {...defaultProps} />);
            const wrapper = container.firstElementChild as HTMLElement;
            wrapper.focus();
            expect(wrapper).toHaveFocus();
        });
    });
});
