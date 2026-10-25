WITH RECURSIVE Trace AS (
    SELECT 
        trace_id,
        span_id,
        parent_span_id,
        start_time,
        end_time,
        operation_name,
        1 AS depth,
        CAST(operation_name AS VARCHAR(1000)) AS trace_path
    FROM
        distrubuted_traces
    WHERE
        trace_id = 'xxx'
        AND parent_span_id IS NULL

    UNION ALL

    SELECT
        dt.trace_id,
        dt.span_id,
        dt.parent_span_id,
        dt.start_time,
        dt.end_time,
        dt.operation_name,
        tr.depth + 1 as depth,
        CAST(tr.trace_path || ' -> ' || dt.operation_name AS VARCHAR(1000)) AS trace_path
    FROM
        distributed_traces dt
    INNER JOIN 
        Trace tr ON tr.span_id = dt.parent_span_id
    WHERE
        dt.trace_id = 'xxx'
)

SELECT
    span_id,
    operation_name,
    parent_span_id,
    start_time,
    EXTRACT(EPOCH, FROM (end_time - start_time)) * 1000 AS duration_ms,
    trace_path
FROM
    Trace
ORDER BY
    trace_path;