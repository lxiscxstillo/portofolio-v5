import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
    MessageCircle, UserCircle2, Loader2, AlertCircle, Send,
    ImagePlus, X, Pin, Briefcase, CheckCircle2, Star, Quote
} from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';

/* ─────────────────────────────────────────────
   Testimonial Card — display version (image 6 style)
───────────────────────────────────────────── */
const TestimonialCard = memo(({ comment, formatDate, isPinned = false }) => {
    const initials = comment.user_name
        ? comment.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    const { t } = useLanguage();

    return (
        <div
            className={`relative flex flex-col gap-3 p-5 rounded-2xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
                isPinned
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/8'
            }`}
        >
            {isPinned && (
                <div className="flex items-center gap-2 text-white/60 mb-1">
                    <Pin className="w-3 h-3" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                        {t('testimonials.pinned_label')}
                    </span>
                </div>
            )}

            {/* Quote icon */}
            <Quote className="w-5 h-5 text-white/20 absolute top-4 right-4" />

            {/* Stars */}
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>

            {/* Testimonial text */}
            <p className="text-gray-300 text-sm leading-relaxed italic flex-1">
                "{comment.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                {comment.profile_image ? (
                    <img
                        src={comment.profile_image}
                        alt={`${comment.user_name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border border-white/20 flex-shrink-0"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {initials}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight">
                        {comment.user_name}
                        {isPinned && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/15 text-white/70 rounded">
                                Admin
                            </span>
                        )}
                    </p>
                    {(comment.user_role || comment.user_company) && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3 opacity-60 flex-shrink-0" />
                            <span className="truncate">
                                {comment.user_role && comment.user_company
                                    ? `${comment.user_role} · ${comment.user_company}`
                                    : comment.user_role || comment.user_company}
                            </span>
                        </p>
                    )}
                </div>
                <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                    {formatDate(comment.created_at)}
                </span>
            </div>
        </div>
    );
});

/* ─────────────────────────────────────────────
   Testimonial Form
───────────────────────────────────────────── */
const TestimonialForm = memo(({ onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userCompany, setUserCompany] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const { t } = useLanguage();

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageError('');
        if (file.size > 5 * 1024 * 1024) {
            setImageError(t('testimonials.error_photo_size'));
            if (e.target) e.target.value = '';
            return;
        }
        if (!file.type.startsWith('image/')) {
            setImageError(t('testimonials.error_photo_type'));
            if (e.target) e.target.value = '';
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim() || !userRole.trim() || !userCompany.trim()) return;
        onSubmit({ newComment, userName, userRole, userCompany, imageFile });
        setNewComment('');
        setUserName('');
        setUserRole('');
        setUserCompany('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, userRole, userCompany, imageFile, onSubmit]);

    const inputClass = "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1" data-aos="fade-up" data-aos-duration="800">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('testimonials.label_name')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={40}
                    placeholder={t('testimonials.label_name')}
                    className={inputClass}
                    required
                />
            </div>

            {/* Role + Company */}
            <div className="grid grid-cols-2 gap-3" data-aos="fade-up" data-aos-duration="900">
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {t('testimonials.label_role')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        maxLength={40}
                        placeholder={t('testimonials.placeholder_role')}
                        required
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {t('testimonials.label_company')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={userCompany}
                        onChange={(e) => setUserCompany(e.target.value)}
                        maxLength={40}
                        placeholder={t('testimonials.placeholder_company')}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('testimonials.label_message')} <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={200}
                    onChange={handleTextareaChange}
                    placeholder={t('testimonials.placeholder_message')}
                    className={`${inputClass} resize-none min-h-[100px]`}
                    required
                />
            </div>

            {/* Profile Photo */}
            <div className="space-y-1" data-aos="fade-up" data-aos-duration="1100">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('testimonials.label_photo')}{' '}
                    <span className="text-gray-600 normal-case">({t('testimonials.optional')})</span>
                </label>
                {imageError && (
                    <div className="flex items-center gap-2 px-3 py-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="text-xs">{imageError}</p>
                    </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-12 h-12 rounded-full object-cover border border-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all text-xs cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                                {t('testimonials.remove_photo')}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-dashed border-white/20 hover:border-white/40 text-sm cursor-pointer"
                            >
                                <ImagePlus className="w-4 h-4" />
                                <span>{t('testimonials.choose_photo')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full h-11 bg-white text-black rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('testimonials.btn_submitting')}</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>{t('testimonials.btn_submit')}</span>
                    </>
                )}
            </button>
        </form>
    );
});

/* ─────────────────────────────────────────────
   Device ID helper
───────────────────────────────────────────── */
const getDeviceId = () => {
    const key = 'portfolio_device_id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
};

/* ─────────────────────────────────────────────
   Main Testimonios Component
───────────────────────────────────────────── */
const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [hasCommented, setHasCommented] = useState(false);
    const deviceId = useRef(getDeviceId());

    const { t, lang } = useLanguage();

    useEffect(() => {
        AOS.init({ once: false, duration: 800 });
    }, []);

    /* Check if this device already submitted */
    useEffect(() => {
        const checkExisting = async () => {
            const { data } = await supabase
                .from('portfolio_comments')
                .select('id')
                .eq('device_id', deviceId.current)
                .maybeSingle();
            if (data) setHasCommented(true);
        };
        checkExisting();
    }, []);

    /* Pinned testimonial */
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .maybeSingle();
                if (error) return;
                if (data) setPinnedComment(data);
            } catch (err) {
                console.error('Error fetching pinned testimonial:', err);
            }
        };
        fetchPinnedComment();
    }, []);

    /* All non-pinned testimonials */
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            if (error) {
                setError(t('testimonials.error_load'));
            } else {
                setComments(data || []);
            }
        };

        fetchComments();

        const subscription = supabase
            .channel('portfolio_comments_testimonials')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'portfolio_comments',
                filter: 'is_pinned=eq.false'
            }, fetchComments)
            .subscribe();

        return () => subscription.unsubscribe();
    }, []);

    /* Upload profile image to Supabase Storage */
    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);
        if (uploadError) throw new Error('photo_upload');
        const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
        return data.publicUrl;
    }, []);

    /* Submit handler — saves with is_approved: false, shows toast */
    const handleCommentSubmit = useCallback(async ({ newComment, userName, userRole, userCompany, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        try {
            const profileImageUrl = await uploadImage(imageFile);
            const { error } = await supabase
                .from('portfolio_comments')
                .insert([{
                    content: newComment,
                    user_name: userName,
                    user_role: userRole || null,
                    user_company: userCompany || null,
                    profile_image: profileImageUrl,
                    is_pinned: false,
                    device_id: deviceId.current,
                    created_at: new Date().toISOString()
                }]);
            if (error) throw new Error('insert');
            setHasCommented(true);

            /* Toast notification */
            Swal.fire({
                title: t('testimonials.swal_received_title'),
                text: t('testimonials.review_message'),
                icon: 'success',
                confirmButtonColor: '#ffffff',
                confirmButtonText: 'OK',
                background: '#111111',
                color: '#ffffff',
                timer: 4000,
                timerProgressBar: true,
            });
        } catch (err) {
            if (err.message === 'photo_upload') {
                setError(t('testimonials.error_upload'));
            } else if (!navigator.onLine) {
                setError(t('testimonials.error_offline'));
            } else {
                setError(t('testimonials.error_submit'));
            }
            console.error('Error adding testimonial:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage, t]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMinutes < 1) return t('testimonials.date_just_now');
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
        if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');
        if (diffHours < 24) return rtf.format(-diffHours, 'hour');
        if (diffDays < 7) return rtf.format(-diffDays, 'day');
        return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    }, [lang, t]);

    const totalTestimonials = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div
            className="w-full bg-gradient-to-b from-white/8 to-white/5 rounded-2xl backdrop-blur-xl shadow-xl"
            data-aos="fade-up"
            data-aos-duration="1000"
        >
            {/* Header */}
            <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {t('testimonials.title')}{' '}
                            <span className="text-gray-400 font-normal text-sm">({totalTestimonials})</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{t('testimonials.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* ── Testimonial cards list ── */}
                {(totalTestimonials > 0) && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {t('testimonials.title')}
                        </p>
                        <div
                            className="space-y-3 max-h-[420px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {pinnedComment && (
                                <TestimonialCard
                                    comment={pinnedComment}
                                    formatDate={formatDate}
                                    isPinned={true}
                                />
                            )}
                            {comments.length === 0 && !pinnedComment ? (
                                <div className="text-center py-10">
                                    <UserCircle2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">{t('testimonials.empty')}</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <TestimonialCard
                                        key={comment.id}
                                        comment={comment}
                                        formatDate={formatDate}
                                        isPinned={false}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Empty state when no testimonials at all */}
                {totalTestimonials === 0 && (
                    <div className="text-center py-8">
                        <UserCircle2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">{t('testimonials.empty')}</p>
                    </div>
                )}

                {/* ── Separator ── */}
                <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Send className="w-3 h-3" />
                        {t('testimonials.form_title')}
                    </p>

                    {/* Form or already-submitted message */}
                    {hasCommented ? (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/15">
                            <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-white">{t('testimonials.already_submitted')}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{t('testimonials.already_submitted_desc')}</p>
                            </div>
                        </div>
                    ) : (
                        <TestimonialForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
            `}</style>
        </div>
    );
};

export default Komentar;
