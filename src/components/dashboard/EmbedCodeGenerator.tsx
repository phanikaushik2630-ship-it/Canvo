import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Code2, Copy, Check, ExternalLink, Globe, Sparkles, Terminal } from 'lucide-react';

export const EmbedCodeGenerator: React.FC = () => {
  const { businessData } = useBusiness();
  const { profile, botConfig } = businessData;
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const origin = window.location.origin;
  const publicUrl = `${origin}/b/${profile.slug}`;
  const embedUrl = `${origin}/embed/${profile.slug}`;

  const scriptSnippet = `<!-- Canvo AI Chatbot Embed Widget -->
<script
  src="${origin}/canvo-widget.js"
  data-business-slug="${profile.slug}"
  data-bot-name="${botConfig.botName}"
  data-theme-color="${botConfig.themeColor || '#C9633A'}"
  defer
></script>`;

  const iframeSnippet = `<!-- Canvo AI Chatbot Iframe Widget -->
<iframe
  src="${embedUrl}"
  width="400"
  height="600"
  style="border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"
  title="${botConfig.botName} - ${profile.name} AI Concierge"
></iframe>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-artisan-200">
        <h3 className="font-serif font-bold text-xl text-artisan-950 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-terracotta-500" />
          <span>Embeddable Widget & Public Sharing</span>
        </h3>
        <p className="text-xs text-artisan-500 mt-0.5">
          Deploy your grounded AI concierge anywhere: on your website, Shopify/Squarespace, or share via direct link.
        </p>
      </div>

      {/* Public Storefront Link Card */}
      <div className="p-5 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-artisan-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-terracotta-500" />
            <span>Dedicated Public Storefront Link</span>
          </span>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-800 inline-flex items-center gap-1"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2 bg-artisan-50 border border-artisan-200 rounded-xl p-2 font-mono text-xs text-artisan-800">
          <span className="truncate flex-1">{publicUrl}</span>
          <button
            type="button"
            onClick={() => handleCopy(publicUrl, 'link')}
            className="btn-secondary !text-xs !py-1 !px-3 shrink-0"
          >
            {copiedType === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'link' ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
        <p className="text-[11px] text-artisan-500">
          Share this URL with customers via Instagram bio, Google Business Profile, or QR codes on counter tables.
        </p>
      </div>

      {/* Script Tag Embed Snippet */}
      <div className="p-5 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-artisan-700 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-terracotta-500" />
            <span>1. Website Floating Script Tag (Recommended)</span>
          </span>
          <button
            type="button"
            onClick={() => handleCopy(scriptSnippet, 'script')}
            className="btn-primary !text-xs !py-1.5 !px-3"
          >
            {copiedType === 'script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'script' ? 'Copied Snippet!' : 'Copy Embed Code'}</span>
          </button>
        </div>

        <pre className="bg-artisan-950 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-artisan-800">
          {scriptSnippet}
        </pre>
        <p className="text-[11px] text-artisan-500">
          Paste right before the closing <code>&lt;/body&gt;</code> tag on WordPress, Webflow, Shopify, Squarespace, or any HTML site.
        </p>
      </div>

      {/* Responsive Iframe Embed Snippet */}
      <div className="p-5 rounded-2xl bg-white border border-artisan-200/90 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-artisan-700 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-sage-600" />
            <span>2. Direct Iframe Embed</span>
          </span>
          <button
            type="button"
            onClick={() => handleCopy(iframeSnippet, 'iframe')}
            className="btn-secondary !text-xs !py-1.5 !px-3"
          >
            {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'iframe' ? 'Copied Iframe!' : 'Copy Iframe Code'}</span>
          </button>
        </div>

        <pre className="bg-artisan-950 text-amber-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-artisan-800">
          {iframeSnippet}
        </pre>
      </div>

    </div>
  );
};
