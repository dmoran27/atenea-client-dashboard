<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProfileInfoTab from '../components/ProfileInfoTab.vue'
import ProfileSecurityTab from '../components/ProfileSecurityTab.vue'
import ProfilePreferencesTab from '../components/ProfilePreferencesTab.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/components/ui/tabs'

const { t } = useI18n()
</script>

<template>
  <Tabs default-value="info" class="w-full">
    <TabsList class="grid w-full grid-cols-3">
      <TabsTrigger value="info" class="gap-1.5">
        <User class="h-4 w-4" />
        <span class="hidden sm:inline">{{ t('profile.tabs.info') }}</span>
      </TabsTrigger>
      <TabsTrigger value="security" class="gap-1.5">
        <Lock class="h-4 w-4" />
        <span class="hidden sm:inline">{{ t('profile.tabs.security') }}</span>
      </TabsTrigger>
      <TabsTrigger value="preferences" class="gap-1.5">
        <Settings class="h-4 w-4" />
        <span class="hidden sm:inline">{{ t('profile.tabs.preferences') }}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="info">
      <ProfileInfoTab />
    </TabsContent>

    <TabsContent value="security">
      <ProfileSecurityTab />
    </TabsContent>

    <TabsContent value="preferences">
      <ProfilePreferencesTab />
    </TabsContent>
  </Tabs>
</template>
