-- Cleanup: delete duplicate/old rows (those with null links or duplicate entries)
-- Run this in Supabase Dashboard → SQL Editor → New Query

DELETE FROM projects WHERE id IN (
  '38bd18fa-2628-40c4-be6a-e9c245931170', -- WhatsApp Sales Agent (no link)
  '5d06b9b4-af5a-4e46-b583-79a383598ca9', -- MathScope (no link)
  '5fff7889-c9e5-4016-a5de-0aed5cb97e70', -- Defect Insights duplicate (no link)
  '69064b48-ea5d-4785-ac3a-b584c14f744f', -- Pruebas Unitarias (no link)
  'e1dcfae1-d3f1-400e-b445-964f94a0b7dc', -- Portfolio V5 duplicate
  'f4b2acd5-68dd-4192-8a86-216400a7bbc5'  -- Cobamovil (no link)
);
