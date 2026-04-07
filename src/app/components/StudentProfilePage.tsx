import { useEffect, useMemo, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Star, MapPin, GraduationCap, Briefcase, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { api } from '../api/client';
import { toast } from 'sonner';

interface StudentProfilePageProps {
  userId: number;
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export function StudentProfilePage({ userId, onNavigate, userRole, onLogout }: StudentProfilePageProps) {
  const [student, setStudent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Employer review form
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [u, r] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/reviews/user/${userId}`),
        ]);
        setStudent(u);
        setReviews(r.reviews || []);
        setAverageRating(Number(r.averageRating || 0));
        setReviewCount(Number(r.count || 0));
      } catch (e) {
        console.error('Failed to load student profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const skills = useMemo(() => {
    const raw = student?.skills || '';
    return raw
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  }, [student]);

  const canReview = userRole === 'employer';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview) return;
    if (!comment.trim()) return;
    try {
      setSubmitting(true);
      await api.post('/reviews', {
        reviewedId: userId,
        rating,
        comment: comment.trim(),
      });
      setComment('');
      const r = await api.get(`/reviews/user/${userId}`);
      setReviews(r.reviews || []);
      setAverageRating(Number(r.averageRating || 0));
      setReviewCount(Number(r.count || 0));
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9940A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student || student.role !== 'student') {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div className="bg-white rounded-2xl p-8 shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-bold text-[#111111] mb-2">Profile not found</h2>
            <p className="text-[#777777] mb-6">This student profile is unavailable.</p>
            <button
              onClick={() => onNavigate('applications')}
              className="bg-[#C9940A] text-white px-6 py-3 rounded-xl hover:bg-[#A67800] transition-all"
            >
              Back to Applications
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = (student.name || 'ST')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="applications" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => onNavigate('applications')}
          className="flex items-center text-[#777777] hover:text-[#C9940A] transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Applications
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-md p-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[#111111] text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                  {initials}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-[#111111]">{student.name}</h1>
                  <p className="text-[#777777] text-sm">{student.email ? student.email : 'Student'}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-[#F5F3EF] rounded-2xl p-4">
                  <div className="text-sm text-[#777777] mb-1">Rating</div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-[#C9940A] fill-[#C9940A]" />
                    <div className="text-lg font-bold text-[#111111]">{averageRating.toFixed(1)}</div>
                  </div>
                  <div className="text-xs text-[#777777] mt-1">{reviewCount} review(s)</div>
                </div>
                <div className="bg-[#F5F3EF] rounded-2xl p-4">
                  <div className="text-sm text-[#777777] mb-1">Availability</div>
                  <div className="text-lg font-bold text-[#111111]">Part-time</div>
                  <div className="text-xs text-[#777777] mt-1">Flexible hours</div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center text-[#777777]">
                  <GraduationCap size={18} className="mr-2 text-[#C9940A]" />
                  {student.university || 'University not set'}
                </div>
                <div className="flex items-center text-[#777777]">
                  <Briefcase size={18} className="mr-2 text-[#C9940A]" />
                  {student.major || 'Major not set'}
                </div>
                <div className="flex items-center text-[#777777]">
                  <MapPin size={18} className="mr-2 text-[#C9940A]" />
                  Tunis, Tunisia
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => onNavigate('messaging')}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C9940A] text-white px-4 py-3 rounded-xl hover:bg-[#A67800] transition-all font-semibold"
                >
                  <MessageSquare size={18} />
                  Message
                </button>
                <button
                  onClick={() => onNavigate('settings')}
                  className="flex items-center justify-center bg-[#E5E5E5] text-[#111111] px-4 py-3 rounded-xl hover:bg-[#D5D5D5] transition-all font-semibold"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-bold text-[#111111] mb-4">Skills</h2>
              {skills.length === 0 ? (
                <p className="text-[#777777] text-sm">No skills provided yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string) => (
                    <span key={s} className="bg-[#F5F3EF] text-[#111111] px-3 py-1.5 rounded-full text-sm font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reviews + form */}
          <div className="lg:col-span-2 space-y-6">
            {canReview && (
              <div className="bg-white rounded-3xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#111111] mb-2">Leave a review</h2>
                <p className="text-[#777777] mb-6">You can review a student only after an accepted application.</p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center gap-1 text-[#C9940A]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={18} className={i < rating ? 'fill-[#C9940A]' : 'opacity-30'} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">Comment</label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]"
                      placeholder="Share feedback about professionalism, quality, communication..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className={`bg-[#C9940A] text-white px-6 py-3 rounded-xl hover:bg-[#A67800] transition-all font-semibold ${submitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111111]">Reviews</h2>
                <div className="text-sm text-[#777777]">
                  {reviewCount} total • {averageRating.toFixed(1)} avg
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-10 text-[#777777]">
                  No reviews yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-[#F5F3EF] rounded-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-[#111111]">
                            {rev.reviewer?.companyName || rev.reviewer?.name || 'Employer'}
                          </div>
                          <div className="text-xs text-[#777777] mt-1">
                            {rev.job?.title ? `Job: ${rev.job.title} • ` : ''}
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#C9940A]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={16} className={i < (rev.rating || 0) ? 'fill-[#C9940A]' : 'opacity-30'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#111111] mt-3 whitespace-pre-wrap">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

