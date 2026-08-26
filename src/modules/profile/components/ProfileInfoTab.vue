<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2 } from '@lucide/vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
//import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { useProfile } from '../composables/useProfile'

const { t } = useI18n()
const {
  profile,
  isLoadingProfile,
  updateProfile,
  isUpdatingProfile,
  uploadAvatar,
  // isUploadingAvatar,
} = useProfile()

const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
})

watch(
  profile,
  (newProfile) => {
    if (newProfile) {
      form.value = {
        name: newProfile.name || '',
        email: newProfile.email || '',
        phone: newProfile.phone || '',
      }
    }
  },
  { immediate: true },
)

/*
const initials = computed(() => {
  if (!form.value.name) return 'UA'
  return form.value.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

function triggerFileInput() {
  fileInputRef.value?.click()
}
  */

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadAvatar(file)
  }
}

async function handleSave() {
  await updateProfile(form.value)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('profile.info.title') }}</CardTitle>
      <CardDescription>{{ t('profile.info.description') }}</CardDescription>
    </CardHeader>

    <div v-if="isLoadingProfile" class="flex justify-center p-8">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <template v-else>
      <CardContent class="space-y-6">
        <!-- Input oculto para carga de Avatar -->
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />

        <!-- Sección de Avatar -->
        <!--
        <div class="flex items-center gap-4">

          <div class="relative">

            <Avatar class="h-16 w-16">
              <AvatarImage :src="profile?.avatarUrl" :alt="form.name" />
              <AvatarFallback class="bg-primary/10 text-lg font-semibold text-primary">
                <Loader2 v-if="isUploadingAvatar" class="h-5 w-5 animate-spin" />
                <span v-else>{{ initials }}</span>
              </AvatarFallback>
            </Avatar>


            <Button
              size="icon"
              variant="secondary"
              class="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-sm border"
              :title="t('profile.info.changeAvatar')"
              :disabled="isUploadingAvatar"
              @click="triggerFileInput"
            >
              <Camera class="h-3.5 w-3.5" />
            </Button>
          </div>


          <div>
            <p class="text-sm font-semibold leading-none">{{ form.name || 'Usuario Atenea' }}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ t('profile.info.avatarHint') }}
            </p>
          </div>
        </div>
          -->

        <!-- Formulario -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="profile-name">{{ t('profile.info.name') }}</Label>
            <Input id="profile-name" v-model="form.name" />
          </div>

          <div class="space-y-2">
            <Label for="profile-email">{{ t('profile.info.email') }}</Label>
            <Input id="profile-email" type="email" v-model="form.email" />
          </div>

          <div class="space-y-2 sm:col-span-2">
            <Label for="profile-phone">{{ t('profile.info.phone') }}</Label>
            <Input id="profile-phone" type="tel" v-model="form.phone" />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button :disabled="isUpdatingProfile" @click="handleSave">
          <Loader2 v-if="isUpdatingProfile" class="mr-2 h-4 w-4 animate-spin" />
          {{ isUpdatingProfile ? t('profile.info.saving') : t('profile.info.save') }}
        </Button>
      </CardFooter>
    </template>
  </Card>
</template>
