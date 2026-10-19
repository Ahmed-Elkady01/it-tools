<script setup lang="ts">
import { convertCsvToJson } from './csv-to-json.service';

const { t } = useI18n();

function transformer(csv: string): string {
  const result = convertCsvToJson({ csv });
  return result.success
    ? result.output
    : t(`tools.csv-to-json.errors.${result.error.code}`, { row: result.error.row });
}
</script>

<template>
  <format-transformer
    :input-label="t('tools.csv-to-json.input-label')"
    :input-placeholder="t('tools.csv-to-json.input-placeholder')"
    :output-label="t('tools.csv-to-json.output-label')"
    output-language="json"
    :transformer="transformer"
  />
</template>
