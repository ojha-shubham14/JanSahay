import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';

import type {
  Language,
  SchemeMatch,
} from '@/lib/types';

import {
  t,
  type TranslationKey,
} from '@/i18n/translations';

interface SchemeResultProps {
  lang: Language;
  match: SchemeMatch;
  onProceed: () => void;
  onReset: () => void;
}

export function SchemeResult({
  lang,
  match,
  onProceed,
  onReset,
}: SchemeResultProps) {
  const tr = (
    key: TranslationKey
  ) => t(lang, key);

  const schemeDisplayName = (
    schemeId?: string,
    fallback?: string
  ) => {
    switch (schemeId) {
      case 'micro_finance':
        return tr('microFinanceScheme');

      case 'term_loan':
        return tr('termLoanScheme');

      case 'education_loan':
        return tr('educationLoanScheme');

      default:
        return fallback ?? 'N/A';
    }
  };

  const checkLabel = (
    index: number,
    fallback: string
  ) => {
    const keys: TranslationKey[] = [
      'familyIncomeCheck',
      'purposeCheck',
      'projectCostCheck',
      'financingCheck',
    ];

    return index < keys.length
      ? tr(keys[index])
      : fallback;
  };

  const comparisonReason = (
    reason: string
  ) => {
    if (
      reason ===
      'Meets current demo rules'
    ) {
      return tr('meetsRules');
    }

    if (
      reason ===
      'Purpose does not match'
    ) {
      return tr('purposeMismatch');
    }

    if (
      reason ===
      'Exceeds configured limit'
    ) {
      return tr('exceedsLimit');
    }

    return reason;
  };

  /* =========================================================
     NOT ELIGIBLE
     ========================================================= */

  if (!match.eligible) {
    return (
      <div
        className="
          portal-section
          p-5
          sm:p-6
          animate-slide-up

          bg-white/95
          backdrop-blur-sm

          border
          border-slate-200
          shadow-lg
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            text-center

            py-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-center

              w-16
              h-16

              rounded-full

              bg-red-50

              mb-4
            "
          >
            <XCircle
              className="
                w-8
                h-8
                text-red-600
              "
            />
          </div>

          <h2
            className="
              text-xl
              font-bold

              text-slate-950

              mb-2
            "
          >
            {tr('notEligible')}
          </h2>

          <p
            className="
              text-sm
              text-slate-700

              max-w-md

              mb-6
            "
          >
            {match.reason}
          </p>

          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
          >
            <RotateCcw
              className="w-4 h-4"
            />

            {tr('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = (
    status: string
  ): string => {
    if (status === 'best') {
      return tr('bestMatchStatus');
    }

    if (
      status === 'not_suitable'
    ) {
      return tr('notSuitable');
    }

    return tr('notApplicable');
  };

  return (
    <div
      className="
        portal-section

        p-5
        sm:p-6

        animate-slide-up

        bg-white/95
        backdrop-blur-sm

        border
        border-slate-200

        shadow-lg
      "
    >

      {/* =====================================================
          RESULT HEADING
          ===================================================== */}

      <div
        className="
          mb-6

          rounded-xl

          bg-white

          border
          border-slate-200

          p-4
          sm:p-5

          shadow-sm
        "
      >
        <p
          className="
            text-sm
            font-bold

            text-blue-700

            mb-1
          "
        >
          {tr('bestMatch')}
        </p>

        <h2
          className="
            text-2xl
            sm:text-3xl

            font-bold

            text-slate-950

            leading-tight
          "
        >
          {schemeDisplayName(
            match.scheme_id,
            match.scheme_name
          )}
        </h2>
      </div>


      {/* =====================================================
          WHY THIS SCHEME
          ===================================================== */}

      <div className="mb-6">

        <div
          className="
            rounded-xl

            border
            border-blue-200

            bg-blue-50/95

            p-4
            sm:p-5

            shadow-sm
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <div
              className="
                flex
                items-center
                justify-center

                w-10
                h-10

                rounded-lg

                bg-blue-100

                flex-shrink-0
              "
            >
              <CheckCircle2
                className="
                  w-5
                  h-5

                  text-blue-700
                "
              />
            </div>

            <div className="min-w-0">

              <h3
                className="
                  font-bold

                  text-blue-950

                  mb-1
                "
              >
                {tr('whyScheme')}
              </h3>

              <p
                className="
                  text-sm

                  text-blue-900

                  leading-relaxed
                "
              >
                {tr(
                  'schemeMatchReason'
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ELIGIBILITY CHECKS
          ===================================================== */}

      {match.checks &&
        match.checks.length > 0 && (
          <div className="mb-6">

            <h3
              className="
                text-lg
                font-bold

                text-slate-950

                mb-3
              "
            >
              {tr('whyScheme')}
            </h3>

            <div
              className="
                overflow-hidden

                rounded-xl

                border
                border-slate-300

                bg-white
              "
            >

              {match.checks.map(
                (check, i) => (
                  <div
                    key={i}
                    className="
                      flex
                      items-start
                      gap-3

                      p-4

                      border-b
                      border-slate-200

                      last:border-b-0
                    "
                  >

                    <div
                      className={`
                        flex
                        items-center
                        justify-center

                        w-7
                        h-7

                        rounded-full

                        flex-shrink-0

                        ${
                          check.passed
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }
                      `}
                    >

                      {check.passed ? (
                        <Check
                          className="
                            w-4
                            h-4
                            text-green-700
                          "
                        />
                      ) : (
                        <X
                          className="
                            w-4
                            h-4
                            text-red-600
                          "
                        />
                      )}

                    </div>

                    <p
                      className="
                        text-sm

                        font-medium

                        text-slate-800

                        leading-relaxed
                      "
                    >
                      {checkLabel(
                        i,
                        check.label
                      )}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}


      {/* =====================================================
          LOAN SUMMARY
          ===================================================== */}

      <div className="mb-6">

        <h3
          className="
            text-lg
            font-bold

            text-slate-950

            mb-3
          "
        >
          {tr('loanSummary')}
        </h3>

        <div
          className="
            overflow-hidden

            rounded-xl

            border
            border-slate-300

            bg-white

            shadow-sm
          "
        >

          {/* PROJECT COST */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-center
              sm:justify-between

              gap-2
              sm:gap-4

              p-4

              border-b
              border-slate-200
            "
          >

            <p
              className="
                text-sm

                font-semibold

                text-slate-700
              "
            >
              {tr('projectCost')}
            </p>

            <p
              className="
                text-lg

                font-bold

                text-slate-950

                text-left
                sm:text-right

                break-words
              "
            >
              ₹
              {match.loan_amount?.toLocaleString(
                'en-IN'
              )}
            </p>

          </div>


          {/* FINANCING */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-center
              sm:justify-between

              gap-2
              sm:gap-4

              p-4

              border-b
              border-slate-200
            "
          >

            <p
              className="
                text-sm

                font-semibold

                text-slate-700
              "
            >
              {tr(
                'potentialFinancing'
              )}
            </p>

            <p
              className="
                text-lg

                font-bold

                text-slate-950

                text-left
                sm:text-right
              "
            >
              {match.funding_cap_pct}%
            </p>

          </div>


          {/* INTEREST */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-start
              sm:justify-between

              gap-2
              sm:gap-4

              p-4

              border-b
              border-slate-200
            "
          >

            <p
              className="
                text-sm

                font-semibold

                text-slate-700
              "
            >
              {tr('interestRate')}
            </p>

            <div
              className="
                text-left
                sm:text-right

                min-w-0
              "
            >

              <p
                className="
                  text-lg

                  font-bold

                  text-slate-950

                  break-words
                "
              >
                {match
                  .interest_rate_range?.[0]}
                –
                {match
                  .interest_rate_range?.[1]}
                %

                <span
                  className="
                    text-sm

                    font-semibold

                    text-slate-700

                    ml-1
                  "
                >
                  {tr('perAnnum')}
                </span>

              </p>

              <p
                className="
                  text-xs

                  font-medium

                  text-slate-600

                  mt-1
                "
              >
                * {tr(
                  'illustrativeRange'
                )}
              </p>

            </div>

          </div>


          {/* MORATORIUM */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              sm:items-center
              sm:justify-between

              gap-2
              sm:gap-4

              p-4
            "
          >

            <p
              className="
                text-sm

                font-semibold

                text-slate-700
              "
            >
              {tr('moratorium')}
            </p>

            <p
              className="
                text-lg

                font-bold

                text-slate-950

                text-left
                sm:text-right
              "
            >
              {match
                .moratorium_range?.[0]}
              –
              {match
                .moratorium_range?.[1]}

              <span
                className="
                  text-sm

                  font-semibold

                  text-slate-700

                  ml-1
                "
              >
                {tr('months')}
              </span>
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          COMPARE SCHEMES
          ===================================================== */}

      {match.comparisons && (
        <div className="mb-6">

          <h3
            className="
              text-lg
              font-bold

              text-slate-950

              mb-3
            "
          >
            {tr(
              'compareSchemes'
            )}
          </h3>

          <div
            className="
              overflow-x-auto

              rounded-xl

              border
              border-slate-300

              bg-white

              shadow-sm
            "
          >

            <table
              className="
                w-full
                min-w-[620px]

                text-sm
              "
            >

              <thead
                className="
                  bg-slate-100

                  text-slate-800
                "
              >

                <tr>

                  <th
                    className="
                      px-4
                      py-3

                      text-left

                      font-bold
                    "
                  >
                    {tr('scheme')}
                  </th>

                  <th
                    className="
                      px-4
                      py-3

                      text-left

                      font-bold
                    "
                  >
                    {tr('status')}
                  </th>

                  <th
                    className="
                      px-4
                      py-3

                      text-left

                      font-bold
                    "
                  >
                    {tr('reason')}
                  </th>

                </tr>

              </thead>

              <tbody
                className="
                  divide-y
                  divide-slate-200
                "
              >

                {match.comparisons.map(
                  (c) => (
                    <tr
                      key={
                        c.scheme_id
                      }
                      className={
                        c.status ===
                        'best'
                          ? 'bg-blue-50/80'
                          : 'bg-white'
                      }
                    >

                      <td
                        className="
                          px-4
                          py-3

                          font-semibold

                          text-slate-900
                        "
                      >
                        {schemeDisplayName(
                          c.scheme_id,
                          c.scheme_name
                        )}
                      </td>

                      <td
                        className="
                          px-4
                          py-3
                        "
                      >

                        <span
                          className={`
                            inline-flex

                            text-xs
                            font-bold

                            px-2.5
                            py-1

                            rounded-md

                            ${
                              c.status ===
                              'best'
                                ? `
                                  bg-blue-100
                                  text-blue-800
                                `
                                : c.status ===
                                  'not_applicable'
                                  ? `
                                    bg-slate-200
                                    text-slate-700
                                  `
                                  : `
                                    bg-orange-100
                                    text-orange-800
                                  `
                            }
                          `}
                        >
                          {statusLabel(
                            c.status
                          )}
                        </span>

                      </td>

                      <td
                        className="
                          px-4
                          py-3

                          text-slate-700

                          font-medium

                          text-xs

                          leading-relaxed
                        "
                      >
                        {comparisonReason(
                          c.reason
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}


      {/* =====================================================
          IMPORTANT NOTES
          ===================================================== */}

      <div
        className="
          space-y-3

          mb-6
        "
      >

        {/* Final sanction */}

        <div
          className="
            rounded-xl

            border
            border-orange-200

            bg-orange-50/95

            p-4
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <AlertTriangle
              className="
                w-5
                h-5

                text-orange-700

                flex-shrink-0

                mt-0.5
              "
            />

            <p
              className="
                text-sm

                font-medium

                text-orange-950

                leading-relaxed
              "
            >
              {tr(
                'finalSanctionNote'
              )}
            </p>

          </div>

        </div>


        {/* Prototype data */}

        <div
          className="
            rounded-xl

            border
            border-slate-300

            bg-white

            p-4
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <Info
              className="
                w-5
                h-5

                text-slate-700

                flex-shrink-0

                mt-0.5
              "
            />

            <p
              className="
                text-sm

                font-medium

                text-slate-700

                leading-relaxed
              "
            >
              {tr(
                'prototypeData'
              )}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTIONS
          ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row

          gap-3
        "
      >

        <button
          type="button"
          onClick={onProceed}
          className="
            btn-primary

            flex-1

            !bg-blue-600
            hover:!bg-blue-700

            !text-white

            min-h-[48px]
          "
        >
          {tr('proceedEMI')}

          <ArrowRight
            className="w-5 h-5"
          />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="
            btn-secondary

            min-h-[48px]

            !bg-white
            hover:!bg-slate-50

            !text-slate-800

            !border-slate-300
          "
        >
          <RotateCcw
            className="w-4 h-4"
          />

          {tr('startOver')}
        </button>

      </div>

    </div>
  );
}