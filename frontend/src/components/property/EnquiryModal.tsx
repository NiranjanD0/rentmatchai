'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Send, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/components/ui/notifications';
import { type Property } from '@/src/constants/initialData';

interface EnquiryModalProps {
  property: Property;
  onClose: () => void;
}

export default function EnquiryModal({ property, onClose }: EnquiryModalProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState(
    `Hi ${property.listerName || 'there'}, I found this property on RentMatch AI and I'm interested in scheduling a visit. Is it still available?`
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notify.success(
      `Your visit inquiry for "${property.title}" has been sent to ${property.listerName || 'the owner'}.`,
      'Enquiry Sent'
    );
    onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close modal">
          <X size={19} />
        </button>

        <div className="enquiry-modal-kicker">
          <MessageCircle size={14} /> DIRECT LISTER ENQUIRY
        </div>
        <h2>Ask About This Property</h2>
        <p className="enquiry-subtitle">
          Reach out to <strong>{property.listerName || 'Owner'}</strong> regarding availability, rent details or move-in schedule.
        </p>

            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-group">
                <label>Your Name</label>
                <div className="input-with-icon">
                  <User size={15} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Contact Info</label>
                <div className="form-grid-2">
                  <div className="input-with-icon">
                    <Mail size={15} />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-with-icon">
                    <Phone size={15} />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="primary full"
                disabled={!name.trim() || !email.trim() || !message.trim()}
              >
                <Send size={15} /> Send Enquiry
              </button>
            </form>
      </div>
    </div>
  );
}
