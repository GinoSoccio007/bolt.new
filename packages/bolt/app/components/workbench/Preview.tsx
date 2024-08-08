import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!activePreview) {
      setUrl('');
      setIframeUrl(undefined);

      return;
    }

    if (!iframeUrl) {
      const { baseUrl } = activePreview;

      setUrl(baseUrl);
      setIframeUrl(baseUrl);
    }
  }, [activePreview, iframeUrl]);

  const validateUrl = useCallback(
    (value: string) => {
      if (!activePreview) {
        return false;
      }

      const { baseUrl } = activePreview;

      if (value === baseUrl) {
        return true;
      } else if (value.startsWith(baseUrl)) {
        return ['/', '?', '#'].includes(value.charAt(baseUrl.length));
      }

      return false;
    },
    [activePreview],
  );

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white p-2 flex items-center gap-1.5">
        <IconButton icon="i-ph:arrow-clockwise" onClick={reloadPreview} />
        <div className="flex items-center gap-1 flex-grow bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 hover:focus-within:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-accent">
          <div className="bg-white rounded-full p-[2px] -ml-1">
            <div className="i-ph:info-bold text-lg" />
          </div>
          <input
            ref={inputRef}
            className="w-full bg-transparent outline-none"
            type="text"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && validateUrl(url)) {
                setIframeUrl(url);

                if (inputRef.current) {
                  inputRef.current.blur();
                }
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 bg-white border-t">
        {activePreview ? (
          <iframe ref={iframeRef} className="border-none w-full h-full" src={iframeUrl} />
        ) : (
          <div className="flex w-full h-full justify-center items-center">No preview available</div>
        )}
      </div>
    </div>
  );
});