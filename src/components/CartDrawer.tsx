'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  DEFAULT_DELIVERY_ZONE,
  DELIVERY_ZONES,
  PAYMENT_METHODS,
  type PaymentMethod,
  cartOrderMessage,
  formatPrice,
  whatsappUrl,
} from '@/lib/shop';
import { trackEvent } from '@/lib/tracker';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, totalCount, totalPrice } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(DEFAULT_DELIVERY_ZONE.id);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wave');
  const [formErrors, setFormErrors] = useState<{ name?: string; address?: string }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) ?? DEFAULT_DELIVERY_ZONE;
  const deliveryFee = selectedZone.fee;
  const grandTotal = totalPrice + deliveryFee;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleGroupedWhatsAppOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    const errors: { name?: string; address?: string } = {};
    if (!customerName.trim()) {
      errors.name = 'Veuillez renseigner votre nom complet';
    }
    if (!address.trim()) {
      errors.address = 'Veuillez indiquer votre quartier et un repère';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.name) {
        nameInputRef.current?.focus();
      } else if (errors.address) {
        addressInputRef.current?.focus();
      }
      return;
    }

    setFormErrors({});

    trackEvent({
      type: 'whatsapp_cart_order',
      productName: cart.map((i) => `${i.name} (${i.size}×${i.qty})`).join(', '),
      itemsCount: totalCount,
      amountCfa: grandTotal,
    });

    const msg = cartOrderMessage(cart, {
      customerName: customerName.trim(),
      zone: selectedZone,
      address: address.trim(),
      paymentMethod,
    });

    window.open(whatsappUrl(msg), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panier d'achat momoShop"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md sm:max-w-lg flex-col border-l-2 border-ink bg-paper shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-canvas px-4 sm:px-6 py-3.5 sm:py-5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-ink uppercase tracking-tight">
              Mon Panier
            </h3>
            <span className="rounded-full bg-coral px-2.5 py-0.5 font-mono text-[0.7rem] sm:text-xs font-bold text-white">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Fermer le panier"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-ink/20 text-ink hover:bg-paper transition-colors text-xs sm:text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-canvas shadow-pop mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="font-display text-lg font-bold text-ink">Votre panier est vide</p>
              <p className="mt-1 text-xs text-muted max-w-xs">
                Sélectionnez vos t-shirts dans le catalogue pour composer votre commande.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="btn-ink mt-6 text-xs"
              >
                Explorer le catalogue ↓
              </button>
            </div>
          ) : (
            <>
              {/* 1. Item List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-0.5">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
                    1. Articles sélectionnés ({totalCount})
                  </span>
                  <span className="font-mono text-xs text-ink-soft">
                    Sous-total : <strong className="text-ink font-bold">{formatPrice(totalPrice)}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3.5 rounded-2xl border-2 border-ink/15 bg-canvas/30 p-3 transition-all hover:border-ink/30"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/20 bg-studio">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="truncate pr-1">
                            <h4 className="font-display text-sm font-bold text-ink uppercase truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="inline-block h-3 w-3 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: item.hex }}
                                title={item.colorName}
                              />
                              <p className="font-mono text-[0.72rem] text-muted truncate">
                                Taille : <strong className="text-coral font-bold">{item.size}</strong> • {item.colorName}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            aria-label={`Supprimer ${item.name} en taille ${item.size}`}
                            className="text-muted hover:text-coral transition-colors p-1 text-sm font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Qty buttons */}
                          <div className="flex items-center gap-1.5 rounded-lg border border-ink/20 bg-paper px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQty(item.key, -1)}
                              aria-label="Diminuer la quantité"
                              className="font-bold text-ink hover:text-coral px-1 text-xs"
                            >
                              −
                            </button>
                            <span className="font-mono text-xs font-bold text-ink min-w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.key, 1)}
                              aria-label="Augmenter la quantité"
                              className="font-bold text-ink hover:text-coral px-1 text-xs"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-display text-sm font-extrabold text-ink">
                            {formatPrice(item.unitPrice * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Express Delivery & Checkout Form Section */}
              <div className="rounded-2xl border-2 border-ink bg-paper p-4 sm:p-5 shadow-pop space-y-4">
                <div className="flex items-center justify-between border-b-2 border-ink/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[0.65rem] font-bold text-white">
                      2
                    </span>
                    <h4 className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-tight text-ink">
                      Livraison Express Sénégal
                    </h4>
                  </div>
                  <span className="rounded-full bg-acid border border-ink/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-ink uppercase shadow-[1px_1px_0_0_var(--color-ink)]">
                    Livraison Gratuite 🎁
                  </span>
                </div>

                {/* Client name input */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink mb-1"
                  >
                    Nom & Prénom <span className="text-coral">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="ex: Babacar Fall"
                    className={`w-full rounded-xl border-2 px-3 py-2 text-xs font-sans text-ink placeholder:text-muted/60 transition-colors focus:bg-white focus:outline-none ${
                      formErrors.name ? 'border-coral bg-coral/5' : 'border-ink/20 bg-canvas/40 focus:border-ink'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 font-mono text-[0.68rem] text-coral font-semibold">
                      ⚠ {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Delivery zone selector */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="checkout-zone"
                      className="block font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink"
                    >
                      Zone de livraison <span className="text-coral">*</span>
                    </label>
                    <span className="font-mono text-[0.68rem] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full border border-coral/20">
                      ⚡ {selectedZone.estimatedTime}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="checkout-zone"
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full appearance-none rounded-xl border-2 border-ink/20 bg-canvas/40 px-3 py-2.5 pr-8 text-xs font-sans text-ink focus:border-ink focus:bg-white focus:outline-none transition-colors"
                    >
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — GRATUITE (0 FCFA)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-ink">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted">
                    Frais de livraison : <strong className="text-coral font-bold">GRATUITS / OFFERTS (0 FCFA)</strong> ({selectedZone.estimatedTime})
                  </p>
                </div>

                {/* Address / Landmark input */}
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink mb-1"
                  >
                    Quartier & Repère précis <span className="text-coral">*</span>
                  </label>
                  <input
                    ref={addressInputRef}
                    id="checkout-address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="ex: Mermoz Pyrotechnie, en face de la Brioche Dorée"
                    className={`w-full rounded-xl border-2 px-3 py-2 text-xs font-sans text-ink placeholder:text-muted/60 transition-colors focus:bg-white focus:outline-none ${
                      formErrors.address ? 'border-coral bg-coral/5' : 'border-ink/20 bg-canvas/40 focus:border-ink'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 font-mono text-[0.68rem] text-coral font-semibold">
                      ⚠ {formErrors.address}
                    </p>
                  )}
                </div>

                {/* Payment method selector */}
                <div>
                  <label className="block font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink mb-1.5">
                    Mode de règlement <span className="text-coral">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex flex-col items-center justify-center rounded-xl border-2 py-2 px-1 text-center transition-all ${
                            isSelected
                              ? 'border-ink bg-ink text-white shadow-[2px_2px_0_0_var(--color-coral)] scale-[1.02]'
                              : 'border-ink/20 bg-canvas/30 text-ink hover:border-ink hover:bg-canvas'
                          }`}
                        >
                          <span className="text-base mb-0.5">{pm.icon}</span>
                          <span className="font-mono text-[0.65rem] sm:text-[0.68rem] font-bold leading-tight">
                            {pm.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t-2 border-ink bg-canvas p-4 sm:p-5 space-y-3 shrink-0">
            {/* Real-time price breakdown */}
            <div className="space-y-1.5 rounded-xl border border-ink/15 bg-paper p-3 text-xs font-mono shadow-sm">
              <div className="flex items-center justify-between text-muted">
                <span>Sous-total ({totalCount} {totalCount > 1 ? 'articles' : 'article'})</span>
                <span className="font-bold text-ink">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Livraison ({selectedZone.name.split('(')[0]?.trim() || selectedZone.name})</span>
                <span className="font-bold text-coral">GRATUITE (0 FCFA) 🎁</span>
              </div>
              <div className="border-t border-ink/10 pt-2 flex items-baseline justify-between">
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xs uppercase tracking-wider text-ink">
                    Total net
                  </span>
                  <span className="font-mono text-[0.65rem] text-muted">
                    Règlement : {paymentMethod}
                  </span>
                </div>
                <span className="font-display text-xl sm:text-2xl font-black text-ink">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA Button */}
            <button
              type="button"
              onClick={handleGroupedWhatsAppOrder}
              className="btn-whatsapp w-full min-h-[2.8rem] sm:min-h-[3.2rem] text-xs sm:text-sm py-2 px-3 sm:px-6 shadow-pop hover:shadow-pop-lg transition-all"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
              </svg>
              <span className="truncate">Commander sur WhatsApp ({formatPrice(grandTotal)})</span>
            </button>

            <p className="text-center font-mono text-[0.65rem] text-muted">
              Paiement à la livraison ({paymentMethod}) • Échange direct avec notre service client
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
