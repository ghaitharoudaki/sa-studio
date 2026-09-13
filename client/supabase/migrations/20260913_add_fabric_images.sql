alter table public.fabrics
  add column if not exists images jsonb not null default '[]'::jsonb;

update public.fabrics
set images = jsonb_build_array(image)
where image <> ''
  and (images = '[]'::jsonb or images is null);