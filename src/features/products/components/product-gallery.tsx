"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";

interface ProductGalleryProps {
  images: string[];
  fallbackImage: string;
  title: string;
}

const arrowClasses =
  "rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur hover:bg-white hover:text-slate-900";

export const ProductGallery = ({
  images,
  fallbackImage,
  title,
}: ProductGalleryProps) => {
  const sourceImages = images.length > 0 ? images : [fallbackImage];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = sourceImages.length > 1;

  const showImage = (index: number) =>
    setActiveIndex((index + sourceImages.length) % sourceImages.length);

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white to-slate-100">
        <Image
          src={sourceImages[activeIndex] ?? fallbackImage}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-10 mix-blend-multiply"
        />
        {hasMultiple ? (
          <>
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Tooltip label="Previous image">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => showImage(activeIndex - 1)}
                  aria-label="Previous image"
                  className={arrowClasses}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Tooltip label="Next image">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => showImage(activeIndex + 1)}
                  aria-label="Next image"
                  className={arrowClasses}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
            <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {sourceImages.length}
            </span>
          </>
        ) : null}
      </Card>

      {hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sourceImages.map((image, index) => (
            <Button
              key={image}
              variant="ghost"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white p-0",
                index === activeIndex
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-slate-200 opacity-70 hover:border-slate-300 hover:bg-white hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                loading="lazy"
                sizes="80px"
                className="object-contain p-1.5"
              />
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
