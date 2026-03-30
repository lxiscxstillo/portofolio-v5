import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin, Briefcase, CheckCircle2 } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';

const Comment = memo(({ comment, formatDate, isPinned = false }) => {
    const initials = comment.user_name
        ? comment.user_name.charAt(0).toUpperCase()
        : '?';

    return (
        <div
            className={`px-4 pt-4 pb-3 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
                isPinned
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/8'
            }`}
        >
            {isPinned && (
                <div className="flex items-center gap-2 mb-3 text-white/60">
                    <Pin className="w-3 h-3" />
                    <span className="text-xs font-medium uppercase tracking-widest">Pinned</span>
                </div>
            )}
            <div className="flex items-start gap-3">
                {comment.profile_image ? (
                    <img
                        src={comment.profile_image}
                        alt={`${comment.user_name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border border-white/20 flex-shrink-0"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                        {initials}
                    </div>
                )}
                <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                            <h4 className="font-semibold text-white text-sm leading-tight">
                                {comment.user_name}
                                {isPinned && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/15 text-white/70 rounded">
                                        Admin
                                    </span>
                                )}
                            </h4>
                            {(comment.user_role || comment.user_company) && (
                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 opacity-60" />
                                    {comment.user_role && comment.user_company
                                        ? `${comment.user_role} at ${comment.user_company}`
                                        : comment.user_role || comment.user_company}
                                </p>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                            {formatDate(comment.created_at)}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm break-words leading-relaxed mt-2">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
});

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userCompany, setUserCompany] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            if (e.target) e.target.value = '';
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
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
        if (!newComment.trim() || !userName.trim()) return;
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
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={40}
                    placeholder="Your name"
                    className={inputClass}
                    required
                />
            </div>

            {/* Role + Company side by side */}
            <div className="grid grid-cols-2 gap-3" data-aos="fade-up" data-aos-duration="900">
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role <span className="text-gray-600">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        maxLength={40}
                        placeholder="e.g. CTO"
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Company <span className="text-gray-600">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={userCompany}
                        onChange={(e) => setUserCompany(e.target.value)}
                        maxLength={40}
                        placeholder="e.g. TechCorp"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={200}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className={`${inputClass} resize-none min-h-[100px]`}
                    required
                />
            </div>

            {/* Profile Photo */}
            <div className="space-y-1" data-aos="fade-up" data-aos-duration="1100">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Profile Photo <span className="text-gray-600">(optional)</span>
                </label>
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
                                Remove
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
                                <span>Choose Photo</span>
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
                        <span>Posting...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>Post Comment</span>
                    </>
                )}
            </button>
        </form>
    );
});

// Get or create a persistent device_id in localStorage
const getDeviceId = () => {
    const key = 'portfolio_device_id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
};

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [hasCommented, setHasCommented] = useState(false);
    const deviceId = useRef(getDeviceId());

    useEffect(() => {
        AOS.init({ once: false, duration: 800 });
    }, []);

    // Check if this device already posted a comment
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

    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();
                if (error && error.code !== 'PGRST116') return;
                if (data) setPinnedComment(data);
            } catch (err) {
                console.error('Error fetching pinned comment:', err);
            }
        };
        fetchPinnedComment();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            if (!error) setComments(data || []);
        };

        fetchComments();

        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'portfolio_comments',
                filter: 'is_pinned=eq.false'
            }, fetchComments)
            .subscribe();

        return () => subscription.unsubscribe();
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
        return data.publicUrl;
    }, []);

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
            if (error) throw error;
            setHasCommented(true);
        } catch (err) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    }, []);

    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-gradient-to-b from-white/8 to-white/5 rounded-2xl backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                        Comments <span className="text-gray-400 font-normal text-sm">({totalComments})</span>
                    </h3>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {error && (
                    <div className="flex items-center gap-2 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {hasCommented ? (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/15">
                        <CheckCircle2 className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-white">Comment already submitted</p>
                            <p className="text-xs text-gray-500 mt-0.5">You can only leave one comment per device. Thank you!</p>
                        </div>
                    </div>
                ) : (
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
                )}

                <div className="space-y-3 max-h-[360px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar" data-aos="fade-up" data-aos-delay="200">
                    {pinnedComment && (
                        <Comment comment={pinnedComment} formatDate={formatDate} isPinned={true} />
                    )}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-10">
                            <UserCircle2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                formatDate={formatDate}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
            `}</style>
        </div>
    );
};

export default Komentar;
