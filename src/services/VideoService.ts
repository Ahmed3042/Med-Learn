// VideoService — abstraction for video delivery.
//
// V1: Returns simulated placeholder source and metadata.
//
// FUTURE REPLACEMENT: Replace with Cloudflare Worker call that:
//   1. Validates the student's session JWT
//   2. Checks course entitlement via Supabase RLS
//   3. Returns a time-limited signed Bunny Stream URL
//   4. Optionally embeds a dynamic forensic watermark token

import { CourseService } from './CourseService';

export interface VideoSource {
  type: 'placeholder' | 'local' | 'bunny';
  src?: string;
  title: string;
  durationSeconds: number;
  thumbnailUrl?: string;
  isSimulated: boolean;
}

export const VideoService = {
  // Returns the source for a given lesson's video.
  async getVideoSource(lessonId: string, courseId: string): Promise<VideoSource> {
    // Simulate brief local async fetch
    await new Promise(res => setTimeout(res, 20));

    const lesson = CourseService.getLesson(lessonId);
    const duration = lesson?.durationMinutes ? lesson.durationMinutes * 60 : 1800;

    return {
      type: 'placeholder',
      src: undefined,
      title: lesson ? `${lesson.title} (${lesson.id})` : `Lesson video — ${lessonId} (${courseId})`,
      durationSeconds: duration,
      isSimulated: true,
    };
  },
};
