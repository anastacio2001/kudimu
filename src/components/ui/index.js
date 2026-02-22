/**
 * UI Components - Exportação central de todos os componentes UI
 */

// Importar default exports e re-exportar como named exports
import ButtonComponent from './Button';
import InputComponent from './Input';
import CardComponent from './Card';
import BadgeComponent from './Badge';
import ModalComponent from './Modal';
import DarkModeToggleComponent from './DarkModeToggle';
import PricingCardComponent from './PricingCard';
import TimelineStepComponent from './TimelineStep';
import APIEndpointComponent from './APIEndpoint';
import CampaignCardComponent from './CampaignCard';

// Re-exportar como named exports
export const Button = ButtonComponent;
export const Input = InputComponent;
export const Card = CardComponent;
export const Badge = BadgeComponent;
export const Modal = ModalComponent;
export const DarkModeToggle = DarkModeToggleComponent;
export const PricingCard = PricingCardComponent;
export const TimelineStep = TimelineStepComponent;
export const APIEndpoint = APIEndpointComponent;
export const CampaignCard = CampaignCardComponent;

// Estes já são named exports do arquivo DashboardCards.js
export { StatsCard, ProgressCard, ReputationBadge } from './DashboardCards';
