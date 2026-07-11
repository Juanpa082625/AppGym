-- Diagnóstico del trigger handle_new_user
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar la función del trigger
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

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

-- Probar si podemos insertar manualmente (simulando lo que hace el trigger)
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_business_id uuid;
BEGIN
    -- Intentar crear business
    INSERT INTO businesses (name, plan, created_at, updated_at)
    VALUES ('Test Business', 'free', NOW(), NOW())
    RETURNING id INTO test_business_id;
    
    RAISE NOTICE 'Business creado: %', test_business_id;
    
    -- Intentar crear profile
    INSERT INTO profiles (id, business_id, full_name, email, role, created_at, updated_at)
    VALUES (test_user_id, test_business_id, 'Test User', 'test@example.com', 'owner', NOW(), NOW());
    
    RAISE NOTICE 'Profile creado para user: %', test_user_id;
    
    -- Limpiar
    DELETE FROM profiles WHERE id = test_user_id;
    DELETE FROM businesses WHERE id = test_business_id;
    
    RAISE NOTICE 'Test completado exitosamente';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: % - %', SQLERRM, SQLSTATE;
END $$;
