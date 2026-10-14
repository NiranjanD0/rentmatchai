'use client';

import React from 'react';
import { MapPin, BedDouble, Bath, Maximize2, Heart, ShieldCheck, Sparkles, ArrowUpRight, Edit3, Eye, EyeOff, Trash2 } from 'lucide-react';
import { PROPERTY_STATUS, type Property } from '../constants/initialData';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (id: string) => void;
  isOwner?: boolean;
  onEdit?: (property: Property) => void;
  onToggleStatus?: (id: string) => void;
  onDelete?: (property: Property) => void;
}

export default function PropertyCard({
  property,
  isSaved,
  onToggleSave,
  onOpenDetails,
  isOwner = false,
  onEdit,
  onToggleStatus,
  onDelete
}: PropertyCardProps) {
  const p = property;
  const isInactive = p.status === PROPERTY_STATUS.INACTIVE;

  return (
    <article className={`property-card ${isInactive ? 'card-inactive' : ''}`}>
      {/* Image and Floating Badges */}
      <div
        className="card-image"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(p.id)}
        onKeyDown={(e) => e.key === 'Enter' && onOpenDetails(p.id)}
      >
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
          }}
        />

        <span className="type-tag">{p.propertyType || 'Apartment'}</span>

        {p.verified && (
          <span className="verified">
            <ShieldCheck size={12} /> Verified
          </span>
        )}

        {/* Shortlist Heart Button */}
        <button
          className={`heart ${isSaved ? 'saved' : ''}`}
          aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(p.id);
          }}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Match Percentage Badge */}
        {p.match && (
          <span className="match">
            <Sparkles size={12} /> {p.match}% match
          </span>
        )}

        {/* Status Pill for Lister Dashboard */}
        {isOwner && (
          <span className={`status-pill ${p.status === PROPERTY_STATUS.ACTIVE ? 'status-active' : 'status-inactive'}`}>
            <span className={`status-dot ${p.status === PROPERTY_STATUS.ACTIVE ? 'dot-green' : 'dot-gray'}`} />
            {p.status}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div className="location">
          <MapPin size={13} />
          <span>{p.location}</span>
        </div>

        <button className="card-title" onClick={() => onOpenDetails(p.id)}>
          {p.title}
        </button>

        <div className="price-row">
          <div className="price">
            {money(p.rent)} <small>/ month</small>
          </div>
          {p.deposit && (
            <span className="deposit-tag">
              Dep: {money(p.deposit)}
            </span>
          )}
        </div>

        <div className="card-facts">
          <span>
            <BedDouble size={14} /> {p.bedrooms} BHK
          </span>
          <span>
            <Bath size={14} /> {p.bathrooms || 1} Bath
          </span>
          {p.sqft && (
            <span>
              <Maximize2 size={13} /> {p.sqft} sqft
            </span>
          )}
        </div>

        {/* Amenities / Tags */}
        <div className="tags">
          {(p.amenities || []).slice(0, 3).map((t) => (
            <span key={t}>{t}</span>
          ))}
          {p.furnishing && <span className="furnish-tag">{p.furnishing}</span>}
        </div>

        {/* OWNER CONTROLS (Sprint 2 State Diagram: edit, deactivate, delete [owner]) */}
        {isOwner ? (
          <div className="owner-card-actions">
            <button
              type="button"
              className="btn-owner-action edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(p);
              }}
              title="Edit Property Details"
            >
              <Edit3 size={13} /> Edit
            </button>

            <button
              type="button"
              className={`btn-owner-action toggle ${p.status === PROPERTY_STATUS.ACTIVE ? 'deact' : 'react'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus?.(p.id);
              }}
              title={p.status === PROPERTY_STATUS.ACTIVE ? 'Deactivate listing' : 'Reactivate listing'}
            >
              {p.status === PROPERTY_STATUS.ACTIVE ? (
                <>
                  <EyeOff size={13} /> Deactivate
                </>
              ) : (
                <>
                  <Eye size={13} /> Reactivate
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-owner-action delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(p);
              }}
              title="Delete Listing"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <button className="view" onClick={() => onOpenDetails(p.id)}>
            <span>View property details</span>
            <ArrowUpRight size={15} />
          </button>
        )}
      </div>
    </article>
  );
}
