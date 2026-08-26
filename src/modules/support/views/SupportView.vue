<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { HelpCircle, Send, Search, Loader2, LifeBuoy } from '@lucide/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/core/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs'
import { useSupport } from '../composables/useSupport'
import type { CreateTicketPayload } from '../schemas/support.shema'

const { t } = useI18n()

const {
  searchQuery,
  filteredFaqs,
  isLoadingFaqs,
  validationErrors,
  isSubmittingTicket,
  isTicketSent,
  validateAndSubmitTicket,
} = useSupport()

const form = reactive<CreateTicketPayload>({
  subject: '',
  category: 'booking',
  service: '',
  message: '',
})

function handleSubmit() {
  validateAndSubmitTicket(form)
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <Tabs defaultValue="faqs" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="faqs" class="gap-2">
          <HelpCircle class="h-4 w-4" />
          {{ t('support.tabs.faqs') }}
        </TabsTrigger>
        <TabsTrigger value="ticket" class="gap-2">
          <LifeBuoy class="h-4 w-4" />
          {{ t('support.tabs.ticket') }}
        </TabsTrigger>
      </TabsList>

      <!-- Tab: Preguntas Frecuentes -->
      <TabsContent value="faqs">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <HelpCircle class="h-5 w-5 text-primary" />
              {{ t('support.faqTitle') }}
            </CardTitle>
            <CardDescription>{{ t('support.faqDescription') }}</CardDescription>
          </CardHeader>

          <CardContent>
            <div class="relative mb-4">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                class="pl-9"
                :placeholder="t('support.searchPlaceholder')"
              />
            </div>

            <div v-if="isLoadingFaqs" class="flex justify-center py-8">
              <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
            </div>

            <Accordion v-else-if="filteredFaqs.length" type="single" collapsible>
              <AccordionItem v-for="faq in filteredFaqs" :key="faq.id" :value="faq.id">
                <AccordionTrigger>{{ faq.question }}</AccordionTrigger>
                <AccordionContent>{{ faq.answer }}</AccordionContent>
              </AccordionItem>
            </Accordion>

            <p v-else class="py-6 text-center text-sm text-muted-foreground">
              {{ t('support.noResults') }}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab: Crear Ticket -->
      <TabsContent value="ticket">
        <Card>
          <CardHeader>
            <CardTitle>{{ t('support.ticketTitle') }}</CardTitle>
            <CardDescription>{{ t('support.ticketDescription') }}</CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <div
              v-if="isTicketSent"
              class="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"
            >
              {{ t('support.ticketSent') }}
            </div>

            <div class="space-y-2">
              <Label>{{ t('support.subject') }}</Label>
              <Input v-model="form.subject" :disabled="isSubmittingTicket" />
              <p v-if="validationErrors.subject" class="text-xs text-destructive">
                {{ validationErrors.subject }}
              </p>
            </div>

            <div class="space-y-2">
              <Label>{{ t('support.category') }}</Label>
              <select
                v-model="form.category"
                :disabled="isSubmittingTicket"
                class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="booking">{{ t('support.categories.booking') }}</option>
                <option value="payment">{{ t('support.categories.payment') }}</option>
                <option value="account">{{ t('support.categories.account') }}</option>
              </select>
              <p v-if="validationErrors.category" class="text-xs text-destructive">
                {{ validationErrors.category }}
              </p>
            </div>

            <div class="space-y-2">
              <Label>{{ t('support.service') }}</Label>
              <Input v-model="form.service" :disabled="isSubmittingTicket" />
            </div>

            <div class="space-y-2">
              <Label>{{ t('support.message') }}</Label>
              <textarea
                v-model="form.message"
                :disabled="isSubmittingTicket"
                class="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p v-if="validationErrors.message" class="text-xs text-destructive">
                {{ validationErrors.message }}
              </p>
            </div>

            <Button class="w-full gap-2" :disabled="isSubmittingTicket" @click="handleSubmit">
              <Loader2 v-if="isSubmittingTicket" class="h-4 w-4 animate-spin" />
              <Send v-else class="h-4 w-4" />
              {{ t('support.submit') }}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
