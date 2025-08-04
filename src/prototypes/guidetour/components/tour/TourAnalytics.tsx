import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, HelpCircle, RotateCcw, ThumbsUp, ThumbsDown, MessageCircle, Star } from 'lucide-react';
import { useTourManagerContext } from './TourManager';

export const TourAnalytics: React.FC = () => {
  const tourManager = useTourManagerContext();
  const { analytics, feedbackStats, userProfile, progress, flows } = tourManager;

  const completionRate = analytics?.totalToursStarted > 0 
    ? Math.round((analytics.totalToursCompleted / analytics.totalToursStarted) * 100)
    : 0;

  const likeRate = feedbackStats?.totalFeedback > 0
    ? Math.round((feedbackStats.likesCount / feedbackStats.totalFeedback) * 100)
    : 0;

  const mostPopularTour = Object.entries(analytics?.popularTours || {})
    .sort(([,a], [,b]) => b - a)[0];

  const mostSkippedStep = Object.entries(analytics?.mostSkippedSteps || {})
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Tour Analytics</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{completionRate}%</div>
          <div className="text-xs text-blue-600">
            {analytics?.totalToursCompleted || 0} of {analytics?.totalToursStarted || 0} completed
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Engagement</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {analytics?.userEngagement?.helpRequests || 0}
          </div>
          <div className="text-xs text-green-600">Help requests</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {Math.round((analytics?.averageCompletionTime || 0) / 60)}m
          </div>
          <div className="text-xs text-purple-600">Per tour</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-4 border border-orange-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <RotateCcw className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Resets</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {analytics?.userEngagement?.tourResets || 0}
          </div>
          <div className="text-xs text-orange-600">Tour resets</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Like Rate</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{likeRate}%</div>
          <div className="text-xs text-emerald-600">
            {feedbackStats?.likesCount || 0} likes, {feedbackStats?.dislikesCount || 0} dislikes
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-4 border border-yellow-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Avg Rating</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {(feedbackStats?.averageRating || 0).toFixed(1)}
          </div>
          <div className="text-xs text-yellow-600">
            {feedbackStats?.totalFeedback || 0} ratings
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-4 border border-indigo-200/50">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Comments</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900">
            {feedbackStats?.commentsCount || 0}
          </div>
          <div className="text-xs text-indigo-600">Written feedback</div>
        </div>
      </div>

      {/* Popular Tours */}
      {mostPopularTour && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Most Popular Tour</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {flows?.find(f => f.id === mostPopularTour[0])?.name || mostPopularTour[0]}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {mostPopularTour[1]} starts
            </span>
          </div>
        </div>
      )}

      {/* Most Skipped Step */}
      {mostSkippedStep && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Most Skipped Step</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {mostSkippedStep[0]}
            </span>
            <span className="text-sm font-medium text-red-600">
              {mostSkippedStep[1]} skips
            </span>
          </div>
        </div>
      )}

      {/* User Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">User Behavior</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Back Navigation</span>
            <span className="font-medium text-gray-900">
              {analytics?.userEngagement?.backNavigation || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Help Requests</span>
            <span className="font-medium text-gray-900">
              {analytics?.userEngagement?.helpRequests || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tour Resets</span>
            <span className="font-medium text-gray-900">
              {analytics?.userEngagement?.tourResets || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Feedback Submissions</span>
            <span className="font-medium text-gray-900">
              {userProfile?.feedbackSubmissions || 0}
            </span>
          </div>
        </div>
      </div>

        {/* Feedback Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Feedback Categories</h4>
          <div className="space-y-2">
            {Object.entries(feedbackStats?.categoryBreakdown || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{category}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
            {Object.keys(feedbackStats?.categoryBreakdown || {}).length === 0 && (
              <p className="text-sm text-gray-500 italic">No feedback categories yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {(feedbackStats?.totalFeedback || 0) > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedbackStats?.ratingDistribution?.[rating] || 0;
              const percentage = (feedbackStats?.totalFeedback || 0) > 0 
                ? Math.round((count / (feedbackStats?.totalFeedback || 1)) * 100) 
                : 0;
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};