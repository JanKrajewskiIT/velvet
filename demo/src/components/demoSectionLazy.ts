import { lazy } from 'solid-js';

export const LazyCompositesSection = lazy(() => import('../sections/CompositesSection'));
export const LazyDataDisplaySection = lazy(() => import('../sections/DataDisplaySection'));
export const LazyDeveloperSection = lazy(() => import('../sections/DeveloperSection'));
export const LazyFeedbackSection = lazy(() => import('../sections/FeedbackSection'));
export const LazyInputsSection = lazy(() => import('../sections/InputsSection'));
export const LazyLayoutSection = lazy(() => import('../sections/LayoutSection'));
export const LazyNavigationSection = lazy(() => import('../sections/NavigationSection'));
export const LazyOverlaysSection = lazy(() => import('../sections/OverlaysSection'));
export const LazyOverviewSection = lazy(() => import('../sections/OverviewSection'));
export const LazyTablesSection = lazy(() => import('../sections/TablesSection'));
export const LazyTypographySection = lazy(() => import('../sections/TypographySection'));
