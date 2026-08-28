import React from 'react';
import { EmbedChatWidget } from '../components/embed/EmbedChatWidget';

interface EmbedViewProps {
  slug: string;
}

export const EmbedView: React.FC<EmbedViewProps> = ({ slug }) => {
  return <EmbedChatWidget slug={slug} />;
};
