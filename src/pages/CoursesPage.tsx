import { useId, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Clock,
  Users,
  Award,
  ArrowRight,
  ListFilter,
  XCircle,
  Filter,
  Compass,
  MapPin,
} from "lucide-react";
import { Course, coursesData, tracks, levels, Level } from "../data/courses";
import { formatLocationSummary } from "../data/locations";
import { accentStyles, getTrackAccent } from "../lib/trackAccent";
import { levelStyles } from "../lib/levelStyle";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

interface CourseCardProps {
  course: Course;
  onRegister: () => void;
}

const CourseCard = ({ course, onRegister }: CourseCardProps) => {
  const accent = accentStyles[getTrackAccent(course.track)];

  return (
    <div
      className={`bg-white border border-gray-200 border-l-4 ${accent.border} rounded-2xl overflow-hidden hover:shadow-xl transition-all`}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <div className={`text-sm font-medium ${accent.text}`}>
            {course.track}
          </div>
          <div className="flex gap-1.5">
            {course.levels.map((lvl) => (
              <span
                key={lvl}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelStyles[lvl].badgeBg} ${levelStyles[lvl].badgeText}`}
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{formatLocationSummary(course.locations)}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{course.overview}</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            to={`/courses/${course.slug}`}
            className={`flex items-center gap-2 font-medium transition-colors ${accent.text} ${accent.textHover}`}
          >
            View full course details
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Button onClick={onRegister} className="sm:ml-auto w-full sm:w-auto">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

const parseListParam = <T extends string>(value: string | null, allowed: readonly T[]): T[] => {
  if (!value) return [];
  return value.split(",").filter((v): v is T => (allowed as readonly string[]).includes(v));
};

interface FacetFilterProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T[];
  counts: Record<string, number>;
  onChange: (value: T, checked: boolean) => void;
  idPrefix: string;
}

function FacetFilter<T extends string>({
  label,
  options,
  selected,
  counts,
  onChange,
  idPrefix,
}: FacetFilterProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          {label}
          {selected.length > 0 && (
            <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selected.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-56 p-3" align="start">
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">Filter by {label.toLowerCase()}</div>
          <div className="space-y-3">
            {options.map((option, i) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}-${i}`}
                  checked={selected.includes(option)}
                  onCheckedChange={(checked) => onChange(option, checked === true)}
                />
                <Label
                  htmlFor={`${idPrefix}-${i}`}
                  className="flex grow justify-between gap-2 py-1.5 font-normal cursor-pointer"
                >
                  {option}
                  <span className="ms-2 text-xs text-muted-foreground">{counts[option] ?? 0}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface CoursesPageProps {
  onRegisterClick: (courseName: string) => void;
}

export const CoursesPage = ({ onRegisterClick }: CoursesPageProps) => {
  const id = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTracks = useMemo(
    () => parseListParam(searchParams.get("track"), tracks),
    [searchParams]
  );
  const selectedLevels = useMemo(
    () => parseListParam(searchParams.get("level"), levels),
    [searchParams]
  );

  const updateParam = (key: "track" | "level", values: string[]) => {
    const next = new URLSearchParams(searchParams);
    if (values.length === 0) next.delete(key);
    else next.set(key, values.join(","));
    setSearchParams(next, { replace: true });
  };

  const handleTrackChange = (track: string, checked: boolean) => {
    const next = checked
      ? [...selectedTracks, track]
      : selectedTracks.filter((t) => t !== track);
    updateParam("track", next);
  };

  const handleLevelChange = (level: Level, checked: boolean) => {
    const next = checked
      ? [...selectedLevels, level]
      : selectedLevels.filter((l) => l !== level);
    updateParam("level", next);
  };

  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tracks.forEach((track) => {
      counts[track] = coursesData.filter((c) => c.track === track).length;
    });
    return counts;
  }, []);

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    levels.forEach((level) => {
      counts[level] = coursesData.filter((c) => c.levels.includes(level)).length;
    });
    return counts;
  }, []);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coursesData.filter((course) => {
      const matchTrack = selectedTracks.length === 0 || selectedTracks.includes(course.track);
      const matchLevel =
        selectedLevels.length === 0 || course.levels.some((l) => selectedLevels.includes(l));
      const matchQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.overview.toLowerCase().includes(q) ||
        course.track.toLowerCase().includes(q) ||
        course.modules.some((m) => m.title.toLowerCase().includes(q));
      return matchTrack && matchLevel && matchQuery;
    });
  }, [query, selectedTracks, selectedLevels]);

  const hasActiveFilters = selectedTracks.length > 0 || selectedLevels.length > 0 || query.trim() !== "";

  const clearFilters = () => {
    setQuery("");
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-mint pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6">
            Our Courses
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Choose from {coursesData.length} industry-aligned programs designed to advance your tech career.
          </p>
        </div>

        {/* Not sure banner */}
        <Link
          to="/find-my-course"
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-2xl px-6 sm:px-8 py-6 mb-12 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <Compass className="w-9 h-9 flex-shrink-0 hidden sm:block" />
            <div>
              <div className="font-semibold text-lg">Not sure which course is right for you?</div>
              <div className="text-white/80 text-sm">Answer a few quick questions and we'll recommend a path.</div>
            </div>
          </div>
          <span className="flex items-center gap-2 font-medium bg-white/15 px-5 py-2.5 rounded-full group-hover:bg-white/25 transition-colors whitespace-nowrap">
            Find my course
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative w-full sm:w-auto">
            <Input
              id={`${id}-search`}
              ref={inputRef}
              className={`peer w-full sm:min-w-80 ps-9 ${query ? "pe-9" : ""}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, topics, or modules..."
              type="text"
              aria-label="Search courses"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
            </div>
            {query && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <XCircle size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>

          <FacetFilter
            label="Track"
            options={tracks}
            selected={selectedTracks}
            counts={trackCounts}
            onChange={handleTrackChange}
            idPrefix="track"
          />

          <FacetFilter
            label="Level"
            options={levels}
            selected={selectedLevels}
            counts={levelCounts}
            onChange={handleLevelChange}
            idPrefix="level"
          />

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              Clear filters
            </Button>
          )}
        </div>

        {/* Active filter chips */}
        {(selectedTracks.length > 0 || selectedLevels.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedTracks.map((track) => (
              <button
                key={track}
                onClick={() => handleTrackChange(track, false)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${accentStyles[getTrackAccent(track)].bgSoft} ${accentStyles[getTrackAccent(track)].text}`}
              >
                {track}
                <XCircle size={12} strokeWidth={2} />
              </button>
            ))}
            {selectedLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level, false)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${levelStyles[level].badgeBg} ${levelStyles[level].badgeText}`}
              >
                {level}
                <XCircle size={12} strokeWidth={2} />
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-500 mb-6">
          {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
        </div>

        {/* Course Cards */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRegister={() => onRegisterClick(course.title)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <p className="text-xl font-medium text-gray-900 mb-2">No courses match your filters</p>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
            <Button variant="link" onClick={clearFilters} className="hover:no-underline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
