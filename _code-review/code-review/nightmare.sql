-- Query to get prioritized inventory items for processing
SELECT *
FROM (
  SELECT *
  FROM (
    SELECT *
    FROM (
      SELECT
        CONCAT_WS('-',
          CASE WHEN COUNT(*) = 1 THEN 'SINGLE' ELSE 'BATCH' END,
          p.category_id,
          p.vendor_id,
          COALESCE(NULLIF(p.size_variant, ''), 'default'),
          COALESCE(NULLIF(p.color_variant, ''), 'standard')
        ) as processing_key,
        MIN(p.last_inventory_check) as last_sync_time,
        MIN(p.priority_slot) as priority_slot,
        SUM(p.current_stock) as total_stock
      FROM products p
      WHERE p.priority_slot = 1
        AND p.status IN ('ACTIVE', 'LOW_STOCK')
        AND p.last_inventory_check IS NOT NULL
      GROUP BY
        p.category_id,
        p.vendor_id,
        p.size_variant,
        p.color_variant
      ORDER BY
        MIN(p.last_inventory_check) ASC
      LIMIT 50
    ) as product_batches

    UNION ALL

    (
      SELECT *
      FROM (
        SELECT
          CONCAT_WS('-', 'BUNDLE', b.id) as processing_key,
          b.last_updated as last_sync_time,
          b.priority_level as priority_slot,
          (SELECT SUM(bi.quantity) FROM bundle_items bi WHERE bi.bundle_id = b.id) as total_stock
        FROM bundles b
        WHERE b.priority_level = 1
          AND b.is_active = 1
          AND b.last_updated IS NOT NULL
        ORDER BY
          b.last_updated ASC
        LIMIT 50
      ) as bundle_batches
    )

    UNION ALL

    (
      SELECT *
      FROM (
        SELECT
          CONCAT_WS('-', 'PROMO', pm.id) as processing_key,
          pm.last_modified as last_sync_time,
          pm.priority_rank as priority_slot,
          (SELECT COUNT(*) FROM promo_products pp WHERE pp.promo_id = pm.id) as total_stock
        FROM promotions pm
        WHERE pm.priority_rank = 1
          AND pm.is_active = 1
          AND pm.start_date <= NOW()
          AND (pm.end_date IS NULL OR pm.end_date >= NOW())
        ORDER BY
          pm.last_modified ASC
        LIMIT 50
      ) as promo_batches
    )
  ) as combined_items
  ORDER BY
    combined_items.last_sync_time ASC
  LIMIT 100
) as final_queue
WHERE final_queue.total_stock > 0;