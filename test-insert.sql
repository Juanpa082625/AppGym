-- Verificar políticas RLS en businesses
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'businesses';

-- Verificar políticas RLS en profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Probar inserción manual en businesses (sin RLS)
SET LOCAL ROLE postgres;
INSERT INTO businesses (name, slug, plan, created_at, updated_at)
VALUES ('Test Business', 'test-business-' || EXTRACT(EPOCH FROM NOW()), 'free', NOW(), NOW())
RETURNING id, name, slug;

-- Probar inserción manual en profiles (sin RLS)
INSERT INTO profiles (id, business_id, full_name, role, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM businesses WHERE slug LIKE 'test-business-%' ORDER BY created_at DESC LIMIT 1),
    'Test User',
    'owner',
    NOW(),
    NOW()
)
RETURNING id, business_id, full_name, role;

-- Limpiar datos de prueba
DELETE FROM profiles WHERE full_name = 'Test User';
DELETE FROM businesses WHERE slug LIKE 'test-business-%';

RESET ROLE;
