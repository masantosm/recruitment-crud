import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HomeView from '@/interfaces/views/HomeView.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useCandidateStore } from '@/interfaces/stores/useCandidateStore'
import Card from '@/interfaces/components/Card.vue'
import HeaderComponent from '@/interfaces/components/HeaderComponent.vue'
import { Status } from '@/domain/models/Status'

describe('HomeView.vue', () => {
  let candidateStore: ReturnType<typeof useCandidateStore>
  const mockGetCandidateStatus: Status[] = [
    {
      id: 'id-1',
      name: 'Interview',
      order: 'status-1',
      companyId: 'companyId-1',
      createdAt: 'createdAt-1',
      updatedAt: 'updatedAt-1',
      vacancyId: 'vacancyId-1'
    },
    {
      id: 'id-2',
      name: 'Interview',
      order: 'status-2',
      companyId: 'companyId-2',
      createdAt: 'createdAt-2',
      updatedAt: 'updatedAt-2',
      vacancyId: 'vacancyId-2'
    }
  ]
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    candidateStore = useCandidateStore()
    candidateStore.loadCandidateStatus = vi.fn()
    candidateStore.loadCandidatesVacancy = vi.fn()
    candidateStore.vacancyStatus = mockGetCandidateStatus
    candidateStore.vacancyId = 'vacancy-123'
  })

  it('should load candidate status on shallowMounted', () => {
    shallowMount(HomeView)
    expect(candidateStore.loadCandidateStatus).toHaveBeenCalledWith('vacancy-123')
    expect(candidateStore.loadCandidatesVacancy).toHaveBeenCalledWith('vacancy-123')
  })

  it('should render HeaderComponent', () => {
    const wrapper = shallowMount(HomeView)
    expect(wrapper.findComponent(HeaderComponent).exists()).toBeTruthy()
  })

  it('should render Card components based on vacancyStatus', () => {
    const wrapper = shallowMount(HomeView)

    const cards = wrapper.findAllComponents(Card)
    expect(cards.length).toBe(candidateStore.getCandidateStatus.length)
    expect(cards[0].props().config).toEqual(candidateStore.getCandidateStatus[0])
    expect(cards[1].props().config).toEqual(candidateStore.getCandidateStatus[1])
  })

  it('should not render anything if vacancyStatus is empty', () => {
    candidateStore.vacancyStatus = []
    const wrapper = shallowMount(HomeView)

    const cards = wrapper.findAllComponents(Card)
    expect(cards.length).toBe(0)
  })
})
