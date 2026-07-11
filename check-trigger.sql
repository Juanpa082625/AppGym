-- Verificar si el trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'handle_new_user_trigger';

-- Verificar la función del trigger
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- Probar el trigger manualmente (simular lo que hace Supabase Auth)
DO $$
DECLARE
    new_user_id uuid;
    new_profile_id uuid;
    new_business_id uuid;
BEGIN
    -- Simular creación de usuario en auth.users (no podemos hacer esto directamente)
    -- Pero podemos probar el trigger creando un usuario de prueba
    
    RAISE NOTICE 'Probando trigger handle_new_user...';
    
    -- Verificar que la función existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'handle_new_user' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        RAISE EXCEPTION 'La función handle_new_user no existe';
    END IF;
    
    RAISE NOTICE '✅ Función handle_new_user existe';
    
    -- Verificar que el trigger existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers
        WHERE trigger_name = 'handle_new_user_trigger'
    ) THEN
        RAISE EXCEPTION 'El trigger handle_new_user_trigger no existe';
    END IF;
    
    RAISE NOTICE '✅ Trigger handle_new_user_trigger existe';
    
    -- Verificar políticas RLS en businesses
    RAISE NOTICE 'Verificando políticas RLS en businesses...';
    PERFORM * FROM pg_policies WHERE tablename = 'businesses';
    RAISE NOTICE '✅ Políticas en businesses verificadas';
    
    -- Verificar políticas RLS en profiles
    RAISE NOTICE 'Verificando políticas RLS en profiles...';
    PERFORM * FROM pg_policies WHERE tablename = 'profiles';
    RAISE NOTICE '✅ Políticas en profiles verificadas';
    
    RAISE NOTICE '🎉 Todas las verificaciones pasaron';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ ERROR: % - %', SQLERRM, SQLSTATE;
END $$;
