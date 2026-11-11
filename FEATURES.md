# DrawDesk — feature board

Status: `mvp` | `next` | `later` | `killed`. Every mvp line has a flag, a test,
and an acceptance line in `docs/02-features.md`.

| area | feature | flag | deps | status | owner | evidence |
|------|---------|------|------|--------|-------|----------|
| calc | optimal salary/dividend split | ff_core | none | mvp | builder | market.md#gaps 1 |
| calc | tax-year switch + delta | ff_years | ff_core | mvp | builder | market.md#demand |
| plan | multi-year extract vs spread | ff_plan | ff_core | mvp | builder | market.md#gaps 1 |
| pension | employer pension + trade-off | ff_pension | ff_core | mvp | builder | market.md#gaps 2 |
| calc | next £1,000 by route | ff_marginal | ff_core | mvp | builder | market.md#gaps 4 |
| ux | shareable URL + copy | ff_share | ff_core | mvp | builder | market.md#gaps 3 |
| trust | methodology + sources | ff_method | none | mvp | growth | market.md#gaps 5 |
| content | take-home by profit reference table | ff_ref | ff_core | shipped | growth | market.md#demand |
| model | two directors + Employment Allowance | ff_two | ff_core | next | - | market.md#feature-frequency |
| model | Scottish bands | ff_scot | ff_core | next | - | market.md#feature-frequency |
| model | student loan plans | ff_sl | ff_core | next | - | market.md#feature-frequency |
| model | child benefit / £100k warnings | ff_traps | ff_core | next | - | market.md#feature-frequency |
| export | PDF | ff_pdf | ff_core | later | - | competitor parity |
| auth | accounts / saved scenarios | - | backend | killed | - | not the wedge |
