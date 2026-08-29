import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  LIMITS,
  GIG_CATEGORIES,
  ARRANGEMENT_TYPES,
  PAY_KINDS,
  PAY_RATE_UNITS,
  POSTED_AS_TYPES,
  PRESET_LOCATIONS,
  computeIsUrgent,
  validateLeadTime,
  formatLKR,
  formatDateTime,
} from './posting.constants.js';

export default function PostingCreateScreen({ navigation }) {
  // Step navigation (1: Details, 2: Pay & Schedule, 3: Logistics & Poster, 4: Location)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('RETAIL');
  const [description, setDescription] = useState('');

  const [arrangementType, setArrangementType] = useState('GIG');
  const [payKind, setPayKind] = useState('FIXED_TOTAL');
  const [payAmount, setPayAmount] = useState('');
  const [payRateUnit, setPayRateUnit] = useState('DAY');
  const [internshipPayChoice, setInternshipPayChoice] = useState('PAID');
  const [schedule, setSchedule] = useState('');

  const [workersNeeded, setWorkersNeeded] = useState(1);
  // Default start time: +30 hours from now (an urgent gig by default for quick testing)
  const defaultStartTime = useMemo(() => {
    const d = new Date(Date.now() + 30 * 60 * 60 * 1000);
    return d.toISOString();
  }, []);
  const [startAt, setStartAt] = useState(defaultStartTime);

  const [postedAsType, setPostedAsType] = useState('INDIVIDUAL');
  const [postedBusinessName, setPostedBusinessName] = useState('');
  const [postedBusinessBio, setPostedBusinessBio] = useState('');

  const [locationAddress, setLocationAddress] = useState(PRESET_LOCATIONS[0].address);
  const [locationAreaLabel, setLocationAreaLabel] = useState(PRESET_LOCATIONS[0].areaLabel);
  const [locationLat, setLocationLat] = useState(PRESET_LOCATIONS[0].lat);
  const [locationLng, setLocationLng] = useState(PRESET_LOCATIONS[0].lng);

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Computed urgency preview (FR-POST-07)
  const isUrgentPreview = useMemo(() => computeIsUrgent(startAt), [startAt]);
  // Lead time validation check (FR-POST-05)
  const leadTimeCheck = useMemo(() => validateLeadTime(startAt), [startAt]);

  // Handle preset location selection
  const handleSelectPresetLocation = (preset) => {
    setLocationAreaLabel(preset.areaLabel);
    setLocationAddress(preset.address);
    setLocationLat(preset.lat);
    setLocationLng(preset.lng);
  };

  // Helper for setting start time with relative hours
  const handleSetRelativeStartTime = (hoursFromNow) => {
    const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    setStartAt(d.toISOString());
  };

  // Arrangement Type change handler - resets appropriate pay kind
  const handleArrangementChange = (type) => {
    setArrangementType(type);
    if (type === 'GIG') {
      setPayKind('FIXED_TOTAL');
    } else if (type === 'PART_TIME') {
      setPayKind('RATE');
    } else if (type === 'INTERNSHIP') {
      if (internshipPayChoice === 'UNPAID') setPayKind('UNPAID');
      else if (internshipPayChoice === 'STIPEND') setPayKind('STIPEND');
      else setPayKind('PAID');
    }
  };

  // Internship choice change handler
  const handleInternshipChoiceChange = (choice) => {
    setInternshipPayChoice(choice);
    if (choice === 'UNPAID') {
      setPayKind('UNPAID');
      setPayAmount('');
    } else if (choice === 'STIPEND') {
      setPayKind('STIPEND');
    } else {
      setPayKind('PAID');
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required (FR-POST-01).';
    } else if (title.trim().length > LIMITS.TITLE_MAX) {
      errs.title = `Title cannot exceed ${LIMITS.TITLE_MAX} characters.`;
    }

    if (!category) {
      errs.category = 'Please select a task category (FR-POST-02).';
    }

    if (!description.trim()) {
      errs.description = 'Description is required (FR-POST-01).';
    } else if (description.trim().length > LIMITS.DESCRIPTION_MAX) {
      errs.description = `Description cannot exceed ${LIMITS.DESCRIPTION_MAX} characters.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs = {};
    if (payKind !== 'UNPAID') {
      const num = parseFloat(payAmount);
      if (!payAmount || isNaN(num) || num <= 0) {
        errs.payAmount = 'Please enter a valid pay amount greater than 0.';
      }
    }

    if (arrangementType === 'PART_TIME' && !payRateUnit) {
      errs.payRateUnit = 'Select rate frequency (day, week, month).';
    }

    if ((arrangementType === 'PART_TIME' || arrangementType === 'INTERNSHIP') && !schedule.trim()) {
      errs.schedule = 'Schedule is required for part-time and internship listings (FR-POST-03).';
    } else if (schedule.trim().length > LIMITS.SCHEDULE_MAX) {
      errs.schedule = `Schedule cannot exceed ${LIMITS.SCHEDULE_MAX} characters.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs = {};
    if (!workersNeeded || workersNeeded < LIMITS.WORKERS_MIN || workersNeeded > LIMITS.WORKERS_MAX) {
      errs.workersNeeded = `Workers needed must be between ${LIMITS.WORKERS_MIN} and ${LIMITS.WORKERS_MAX} (FR-POST-06).`;
    }

    if (!leadTimeCheck.valid) {
      errs.startAt = leadTimeCheck.message;
    }

    if (postedAsType === 'BUSINESS') {
      if (!postedBusinessName.trim()) {
        errs.postedBusinessName = 'Business name is required when posting as a business (FR-ACC-02).';
      } else if (postedBusinessName.trim().length > LIMITS.BUSINESS_NAME_MAX) {
        errs.postedBusinessName = `Business name cannot exceed ${LIMITS.BUSINESS_NAME_MAX} chars.`;
      }
      if (postedBusinessBio.trim().length > LIMITS.BUSINESS_BIO_MAX) {
        errs.postedBusinessBio = `Business bio cannot exceed ${LIMITS.BUSINESS_BIO_MAX} chars.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation
  const validateStep4 = () => {
    const errs = {};
    if (!locationAddress.trim()) {
      errs.locationAddress = 'Precise street address is required (FR-POST-01).';
    }
    if (!locationAreaLabel.trim()) {
      errs.locationAreaLabel = 'Area/suburb label is required for coarse public preview (FR-POST-08).';
    }
    if (locationLat == null || locationLng == null || isNaN(locationLat) || isNaN(locationLng)) {
      errs.locationCoordinates = 'Valid map coordinates are required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Advance to next step
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    } else if (currentStep === 4 && validateStep4()) {
      handleProceedToReview();
    }
  };

  // Go to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  // Transition to Review Screen (FR-POST-09)
  const handleProceedToReview = () => {
    const formData = {
      title: title.trim(),
      category,
      description: description.trim(),
      arrangementType,
      payKind,
      payAmount: payKind === 'UNPAID' ? null : parseFloat(payAmount),
      payRateUnit: payKind === 'RATE' ? payRateUnit : null,
      postedAsType,
      postedBusinessName: postedAsType === 'BUSINESS' ? postedBusinessName.trim() : null,
      postedBusinessBio: postedAsType === 'BUSINESS' ? postedBusinessBio.trim() : null,
      workersNeeded: parseInt(workersNeeded, 10),
      startAt,
      schedule: ['PART_TIME', 'INTERNSHIP'].includes(arrangementType) ? schedule.trim() : null,
      locationAddress: locationAddress.trim(),
      locationAreaLabel: locationAreaLabel.trim(),
      locationLat: parseFloat(locationLat),
      locationLng: parseFloat(locationLng),
      isUrgent: isUrgentPreview,
    };

    navigation.navigate('PostingReview', { formData });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Step Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.stepsHeader}>
            <Text style={styles.stepTitle}>
              {currentStep === 1 && '1. Gig Details'}
              {currentStep === 2 && '2. Pay & Schedule'}
              {currentStep === 3 && '3. Schedule & Workers'}
              {currentStep === 4 && '4. Location & Privacy'}
            </Text>
            <Text style={styles.stepCounter}>Step {currentStep} of 4</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${(currentStep / 4) * 100}%` }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ========================================================================= */}
          {/* STEP 1: TITLE, CATEGORY, DESCRIPTION (FR-POST-01, FR-POST-02) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionHeading}>Basic Information</Text>
              <Text style={styles.sectionSub}>
                Provide clear, concise details about the task needed.
              </Text>

              {/* Title Field (Cap: 80 chars) */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    Gig Title <Text style={styles.required}>*</Text>
                  </Text>
                  <Text
                    style={[
                      styles.charCount,
                      title.length > LIMITS.TITLE_MAX - 10 && styles.charCountWarning,
                    ]}
                  >
                    {title.length} / {LIMITS.TITLE_MAX}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="e.g. Weekend Retail Sales Assistant"
                  value={title}
                  onChangeText={(val) => {
                    if (val.length <= LIMITS.TITLE_MAX) setTitle(val);
                  }}
                  maxLength={LIMITS.TITLE_MAX}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Category Allow-list (FR-POST-02) */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    Task Category <Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.helperTag}>Allow-list Only</Text>
                </View>
                <Text style={styles.fieldNote}>
                  Select from approved youth-safe gig categories (no free text).
                </Text>

                <View style={styles.categoryGrid}>
                  {GIG_CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                        onPress={() => setCategory(cat.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                        <Text
                          style={[
                            styles.categoryLabel,
                            isSelected && styles.categoryLabelSelected,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              </View>

              {/* Description Field (Cap: 1000 chars) */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    Task Description <Text style={styles.required}>*</Text>
                  </Text>
                  <Text
                    style={[
                      styles.charCount,
                      description.length > LIMITS.DESCRIPTION_MAX - 50 && styles.charCountWarning,
                    ]}
                  >
                    {description.length} / {LIMITS.DESCRIPTION_MAX}
                  </Text>
                </View>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the responsibilities, required skills, tools provided, and expectations..."
                  value={description}
                  onChangeText={(val) => {
                    if (val.length <= LIMITS.DESCRIPTION_MAX) setDescription(val);
                  }}
                  maxLength={LIMITS.DESCRIPTION_MAX}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: ARRANGEMENT, PAY FORMAT & SCHEDULE (FR-POST-03, FR-POST-04) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionHeading}>Arrangement & Pay</Text>
              <Text style={styles.sectionSub}>
                Pay format adapts based on whether this is a one-off gig or recurring role.
              </Text>

              {/* Arrangement Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Arrangement Type <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.arrangementContainer}>
                  {ARRANGEMENT_TYPES.map((type) => {
                    const isSelected = arrangementType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.arrangementCard,
                          isSelected && styles.arrangementCardSelected,
                        ]}
                        onPress={() => handleArrangementChange(type.id)}
                      >
                        <View style={styles.radioRow}>
                          <View
                            style={[
                              styles.radioButton,
                              isSelected && styles.radioButtonSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioButtonDot} />}
                          </View>
                          <Text
                            style={[
                              styles.arrangementLabel,
                              isSelected && styles.arrangementLabelSelected,
                            ]}
                          >
                            {type.label}
                          </Text>
                        </View>
                        <Text style={styles.arrangementDesc}>{type.description}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Conditional Pay Inputs per FR-POST-04 */}
              <View style={styles.paySectionBox}>
                <Text style={styles.boxTitle}>💵 Stated Pay Format (in LKR)</Text>

                {/* 1. GIG (Fixed Total) */}
                {arrangementType === 'GIG' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Fixed Total Pay (per worker) <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.currencyInputRow}>
                      <View style={styles.currencyPrefix}>
                        <Text style={styles.currencyPrefixText}>Rs.</Text>
                      </View>
                      <TextInput
                        style={[styles.currencyInput, errors.payAmount && styles.inputError]}
                        placeholder="e.g. 3500"
                        keyboardType="numeric"
                        value={payAmount}
                        onChangeText={setPayAmount}
                      />
                    </View>
                    {errors.payAmount && <Text style={styles.errorText}>{errors.payAmount}</Text>}
                  </View>
                )}

                {/* 2. PART-TIME JOB (Rate + Unit) */}
                {arrangementType === 'PART_TIME' && (
                  <View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Pay Rate Amount (per worker) <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.currencyInputRow}>
                        <View style={styles.currencyPrefix}>
                          <Text style={styles.currencyPrefixText}>Rs.</Text>
                        </View>
                        <TextInput
                          style={[styles.currencyInput, errors.payAmount && styles.inputError]}
                          placeholder="e.g. 2500"
                          keyboardType="numeric"
                          value={payAmount}
                          onChangeText={setPayAmount}
                        />
                      </View>
                      {errors.payAmount && <Text style={styles.errorText}>{errors.payAmount}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Rate Frequency <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.unitRow}>
                        {PAY_RATE_UNITS.map((unit) => (
                          <TouchableOpacity
                            key={unit.id}
                            style={[
                              styles.unitChip,
                              payRateUnit === unit.id && styles.unitChipSelected,
                            ]}
                            onPress={() => setPayRateUnit(unit.id)}
                          >
                            <Text
                              style={[
                                styles.unitChipText,
                                payRateUnit === unit.id && styles.unitChipTextSelected,
                              ]}
                            >
                              {unit.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {errors.payRateUnit && (
                        <Text style={styles.errorText}>{errors.payRateUnit}</Text>
                      )}
                    </View>
                  </View>
                )}

                {/* 3. INTERNSHIP (Unpaid, Stipend, Paid) */}
                {arrangementType === 'INTERNSHIP' && (
                  <View>
                    <Text style={styles.label}>Internship Compensation</Text>
                    <View style={styles.unitRow}>
                      {['UNPAID', 'STIPEND', 'PAID'].map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.unitChip,
                            internshipPayChoice === c && styles.unitChipSelected,
                          ]}
                          onPress={() => handleInternshipChoiceChange(c)}
                        >
                          <Text
                            style={[
                              styles.unitChipText,
                              internshipPayChoice === c && styles.unitChipTextSelected,
                            ]}
                          >
                            {c === 'UNPAID' ? 'Unpaid' : c === 'STIPEND' ? 'Stipend' : 'Paid'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {internshipPayChoice !== 'UNPAID' && (
                      <View style={[styles.inputGroup, { marginTop: 12 }]}>
                        <Text style={styles.label}>
                          {internshipPayChoice === 'STIPEND' ? 'Monthly Stipend' : 'Monthly Pay'} (per worker){' '}
                          <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.currencyInputRow}>
                          <View style={styles.currencyPrefix}>
                            <Text style={styles.currencyPrefixText}>Rs.</Text>
                          </View>
                          <TextInput
                            style={[styles.currencyInput, errors.payAmount && styles.inputError]}
                            placeholder="e.g. 20000"
                            keyboardType="numeric"
                            value={payAmount}
                            onChangeText={setPayAmount}
                          />
                        </View>
                        {errors.payAmount && (
                          <Text style={styles.errorText}>{errors.payAmount}</Text>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {/* Per-worker notice (FR-POST-04) */}
                <View style={styles.noticeBox}>
                  <Text style={styles.noticeText}>
                    💡 <Text style={styles.boldText}>Per-Worker Stated Pay:</Text> Figures apply to
                    each worker individually, never divided across multiple workers.
                  </Text>
                </View>
              </View>

              {/* Schedule Field (Required for Part-time & Internship, FR-POST-03) */}
              {['PART_TIME', 'INTERNSHIP'].includes(arrangementType) && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>
                      Recurring Schedule <Text style={styles.required}>*</Text>
                    </Text>
                    <Text
                      style={[
                        styles.charCount,
                        schedule.length > LIMITS.SCHEDULE_MAX - 20 && styles.charCountWarning,
                      ]}
                    >
                      {schedule.length} / {LIMITS.SCHEDULE_MAX}
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.input, errors.schedule && styles.inputError]}
                    placeholder="e.g. Mon–Fri, 4:00 PM – 8:00 PM"
                    value={schedule}
                    onChangeText={(val) => {
                      if (val.length <= LIMITS.SCHEDULE_MAX) setSchedule(val);
                    }}
                    maxLength={LIMITS.SCHEDULE_MAX}
                  />
                  {errors.schedule && <Text style={styles.errorText}>{errors.schedule}</Text>}
                </View>
              )}
            </View>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: WORKERS, SCHEDULE & POSTER TYPE (FR-POST-05, FR-POST-06, FR-POST-07, FR-POST-16) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionHeading}>Schedule & Slots</Text>
              <Text style={styles.sectionSub}>
                Set the number of openings and the start date/time.
              </Text>

              {/* Workers Needed Stepper (FR-POST-06: 1 to 20, default 1) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Workers Needed (1–20) <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, workersNeeded <= 1 && styles.stepperBtnDisabled]}
                    onPress={() => setWorkersNeeded((prev) => Math.max(1, prev - 1))}
                    disabled={workersNeeded <= 1}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>

                  <View style={styles.stepperValueBox}>
                    <Text style={styles.stepperValue}>{workersNeeded}</Text>
                    <Text style={styles.stepperSub}>
                      {workersNeeded === 1 ? 'Worker slot' : 'Worker slots'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.stepperBtn,
                      workersNeeded >= LIMITS.WORKERS_MAX && styles.stepperBtnDisabled,
                    ]}
                    onPress={() => setWorkersNeeded((prev) => Math.min(LIMITS.WORKERS_MAX, prev + 1))}
                    disabled={workersNeeded >= LIMITS.WORKERS_MAX}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                {errors.workersNeeded && (
                  <Text style={styles.errorText}>{errors.workersNeeded}</Text>
                )}
              </View>

              {/* Start Date & Time with Lead Time Validation (FR-POST-05) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Start Date & Time <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.fieldNote}>
                  Must be at least 2 hours from now (FR-POST-05).
                </Text>

                {/* Quick Shortcut Buttons for Testing/Selection */}
                <View style={styles.quickTimeRow}>
                  <TouchableOpacity
                    style={styles.quickTimeChip}
                    onPress={() => handleSetRelativeStartTime(4)}
                  >
                    <Text style={styles.quickTimeText}>+4 Hours</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickTimeChip, styles.quickTimeChipUrgent]}
                    onPress={() => handleSetRelativeStartTime(30)}
                  >
                    <Text style={styles.quickTimeTextUrgent}>+30h (Urgent)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickTimeChip}
                    onPress={() => handleSetRelativeStartTime(72)}
                  >
                    <Text style={styles.quickTimeText}>+3 Days</Text>
                  </TouchableOpacity>
                </View>

                {/* Display Selected Date/Time */}
                <View style={styles.selectedDateCard}>
                  <Text style={styles.selectedDateLabel}>Selected Start Time:</Text>
                  <Text style={styles.selectedDateVal}>{formatDateTime(startAt)}</Text>
                </View>

                {/* Urgency Badge Preview (FR-POST-07) */}
                <View style={styles.urgencyPreviewCard}>
                  <Text style={styles.urgencyHeader}>Computed Urgency Preview (FR-POST-07):</Text>
                  {isUrgentPreview ? (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>⚡ URGENT GIG (Starts in 24h–48h)</Text>
                      <Text style={styles.urgentBadgeSub}>
                        Will receive proactive priority notification pushes to nearby youth.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.standardBadge}>
                      <Text style={styles.standardBadgeText}>📅 Standard Schedule</Text>
                      <Text style={styles.standardBadgeSub}>
                        Starts outside the 24h–48h urgency window.
                      </Text>
                    </View>
                  )}
                </View>

                {errors.startAt && <Text style={styles.errorText}>{errors.startAt}</Text>}
              </View>

              {/* Posting As Section (FR-ACC-02 / FR-POST-16) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Post As <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.postedAsRow}>
                  {POSTED_AS_TYPES.map((p) => {
                    const isSelected = postedAsType === p.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.postedAsChip, isSelected && styles.postedAsChipSelected]}
                        onPress={() => setPostedAsType(p.id)}
                      >
                        <Text style={styles.postedAsIcon}>{p.icon}</Text>
                        <Text
                          style={[
                            styles.postedAsLabel,
                            isSelected && styles.postedAsLabelSelected,
                          ]}
                        >
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {postedAsType === 'BUSINESS' && (
                  <View style={styles.businessFieldsBox}>
                    <Text style={styles.boxTitle}>🏢 Business Profile Display</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Business Name <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={[styles.input, errors.postedBusinessName && styles.inputError]}
                        placeholder="e.g. Ceylon Urban Retailers Ltd"
                        value={postedBusinessName}
                        onChangeText={setPostedBusinessName}
                        maxLength={LIMITS.BUSINESS_NAME_MAX}
                      />
                      {errors.postedBusinessName && (
                        <Text style={styles.errorText}>{errors.postedBusinessName}</Text>
                      )}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Business Bio (Optional)</Text>
                      <TextInput
                        style={[styles.textAreaSmall, errors.postedBusinessBio && styles.inputError]}
                        placeholder="Brief summary of your business operations..."
                        value={postedBusinessBio}
                        onChangeText={setPostedBusinessBio}
                        maxLength={LIMITS.BUSINESS_BIO_MAX}
                        multiline
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: LOCATION & PRIVACY PREVIEW (FR-POST-08) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.sectionHeading}>Location & Map Pin</Text>
              <Text style={styles.sectionSub}>
                Provide the exact venue address. Job-seekers will see only the coarse area until selected.
              </Text>

              {/* Quick Sri Lankan Preset Locations */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select or Choose a Preset Location</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                  {PRESET_LOCATIONS.map((preset, index) => {
                    const isSelected = locationAreaLabel === preset.areaLabel;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.presetChip, isSelected && styles.presetChipSelected]}
                        onPress={() => handleSelectPresetLocation(preset)}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            isSelected && styles.presetChipTextSelected,
                          ]}
                        >
                          📍 {preset.areaLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Precise Street Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Precise Street Address <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.locationAddress && styles.inputError]}
                  placeholder="e.g. No. 128, Galle Road, Bambalapitiya, Colombo 04"
                  value={locationAddress}
                  onChangeText={setLocationAddress}
                />
                {errors.locationAddress && (
                  <Text style={styles.errorText}>{errors.locationAddress}</Text>
                )}
              </View>

              {/* Suburb / Coarse Area Label */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  General Suburb / Area Label <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.locationAreaLabel && styles.inputError]}
                  placeholder="e.g. Bambalapitiya, Colombo 04"
                  value={locationAreaLabel}
                  onChangeText={setLocationAreaLabel}
                />
                {errors.locationAreaLabel && (
                  <Text style={styles.errorText}>{errors.locationAreaLabel}</Text>
                )}
              </View>

              {/* Coordinates */}
              <View style={styles.coordRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    value={String(locationLat)}
                    onChangeText={(v) => setLocationLat(parseFloat(v) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    value={String(locationLng)}
                    onChangeText={(v) => setLocationLng(parseFloat(v) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Location Privacy Explainer (FR-POST-08) */}
              <View style={styles.privacyBox}>
                <Text style={styles.privacyBoxTitle}>🔒 Two-Tier Location Privacy (FR-POST-08)</Text>
                <Text style={styles.privacyBoxBody}>
                  • <Text style={styles.boldText}>Public Job-Seekers:</Text> Will only see the general area (
                  {locationAreaLabel || 'suburb'}) and approximate map radius.
                  {'\n'}• <Text style={styles.boldText}>Selected Worker Only:</Text> Releases the full street address (
                  {locationAddress || 'exact address'}) upon selection to coordinate arrival safely.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>{currentStep === 1 ? 'Cancel' : 'Back'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentStep === 4 ? 'Review Gig Posting →' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContent: {},
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  charCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  charCountWarning: {
    color: '#EAB308',
    fontWeight: '700',
  },
  helperTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fieldNote: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 110,
  },
  textAreaSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 70,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: '1%',
    marginBottom: 8,
    alignItems: 'center',
  },
  categoryCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },

  // Arrangement
  arrangementContainer: {
    gap: 10,
  },
  arrangementCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
  },
  arrangementCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#2563EB',
  },
  radioButtonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  arrangementLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  arrangementLabelSelected: {
    color: '#1D4ED8',
  },
  arrangementDesc: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 30,
  },

  // Pay Section
  paySectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 18,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currencyPrefixText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  currencyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  unitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  unitChipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  unitChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  noticeBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  noticeText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 6,
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.5,
  },
  stepperBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    lineHeight: 28,
  },
  stepperValueBox: {
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepperSub: {
    fontSize: 12,
    color: '#64748B',
  },

  // Quick Time Row
  quickTimeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  quickTimeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  quickTimeChipUrgent: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  quickTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickTimeTextUrgent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  selectedDateCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  selectedDateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  selectedDateVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  urgencyPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 4,
  },
  urgencyHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
  },
  urgentBadgeText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
  },
  urgentBadgeSub: {
    color: '#991B1B',
    fontSize: 11,
    marginTop: 2,
  },
  standardBadge: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
  },
  standardBadgeText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  standardBadgeSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },

  // Posted As
  postedAsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  postedAsChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  postedAsChipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  postedAsIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  postedAsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  postedAsLabelSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  businessFieldsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 8,
  },

  // Preset Locations
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  presetChipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  presetChipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  presetChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  coordRow: {
    flexDirection: 'row',
  },
  privacyBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginTop: 8,
  },
  privacyBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  privacyBoxBody: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
