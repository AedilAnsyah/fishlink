"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface RatingFormProps {
  orderId: string;
  supplierId: string;
  buyerId?: string;
  onReviewSubmitted?: () => void;
}

export function RatingForm({
  orderId,
  supplierId,
  buyerId = "u4444444-4444-4444-4444-444444444444",
  onReviewSubmitted,
}: RatingFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      await supabase.from("reviews").insert({
        order_id: orderId,
        buyer_id: buyerId,
        supplier_id: supplierId,
        rating,
        comment,
      });
    } catch {
      // Ignore if offline
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();
    }, 600);
  };

  if (submitted) {
    return (
      <div className="bg-success-100 p-5 rounded-2xl border border-success-600/30 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-success-600 mx-auto" />
        <h4 className="font-bold text-ink-900 text-sm">Terima Kasih Atas Ulasan Anda!</h4>
        <p className="text-xs text-ink-700">
          Ulasan Anda membantu meningkatkan kepercayaan terhadap kualitas kesegaran supplier.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-4">
      <div className="space-y-1">
        <h4 className="font-extrabold text-ink-900 text-base flex items-center gap-2">
          <Star className="w-5 h-5 text-warning-600 fill-warning-600" />
          Beri Rating Kesegaran Supplier
        </h4>
        <p className="text-xs text-ink-700">
          Pesanan Anda telah diterima. Bagaimana kualitas & kesegaran hasil laut yang Anda terima?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Selector */}
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-1.5">
            Rating Kualitas (1 - 5 Bintang):
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      active
                        ? "text-warning-600 fill-warning-600"
                        : "text-ink-200 fill-transparent"
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-bold text-ink-900 ml-2">
              {rating} dari 5 Bintang
            </span>
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-1">
            Komentar / Ulasan Kesegaran (Opsional):
          </label>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="contoh: Ikan kakap sangat segar, mata bening, es masih utuh saat sampai resto."
            className="w-full p-3 rounded-xl border border-ink-200 bg-white text-ink-900 text-xs focus:border-ocean-900 outline-none resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs gap-1.5 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? "Kirim Ulasan..." : "Kirim Ulasan"}
        </Button>
      </form>
    </div>
  );
}
