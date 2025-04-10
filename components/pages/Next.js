import { useState, useEffect } from 'react';

const MabinogiExchangeTracker = () => {
  // 지역별 NPC 교환 데이터 정의
  const exchangeData = {
    "티르코네일": [
      {
        npc: "레이널드",
        exchanges: [
          { give: "마요네즈 고기볶음 x2", receive: "치명타 비약 x1", limit: "일 1회", important: false }
        ]
      },
      {
        npc: "라사",
        exchanges: [
          { give: "사과 주스 x1", receive: "고급 연금술 재연소 촉매 x1", limit: "계정당 일 1회", important: true },
          { give: "연금술 부스러기 x3", receive: "고급 연금술 재연소 촉매 x1", limit: "일 1회", important: true },
          { give: "고급 연금술 재연소 촉매 x15", receive: "레어 연금술 재연소 촉매 x1", limit: "일 1회", important: true }
        ]
      },
      {
        npc: "알리사",
        exchanges: [
          { give: "달걀 x10", receive: "연금술 부스러기 x1", limit: "일 1회", important: false },
          { give: "라벤더 꽃 x1", receive: "연금술 부스러기 x1", limit: "일 1회", important: false },
          { give: "달걀 x3", receive: "밀가루 x1", limit: "일 1회", important: false },
          { give: "라벤더 꽃 x1", receive: "밀가루 x1", limit: "일 1회", important: false }
        ]
      },
      {
        npc: "퍼거스",
        exchanges: [
          { give: "분해된 장비 부품 x1", receive: "철 광석 x1", limit: "일 10회", important: false },
          { give: "분해된 장비 부품 x1", receive: "석탄 x1", limit: "일 10회", important: false },
          { give: "강철괴 x2", receive: "합금강괴 x1", limit: "일 4회", important: false }
        ]
      }
    ],
    "두갈드아일": [
      {
        npc: "엘빈",
        exchanges: [
          { give: "야채 볶음 x1", receive: "상급 목재 x1", limit: "일 2회", important: false }
        ]
      },
      {
        npc: "트레이시",
        exchanges: [
          { give: "조개찜 x2", receive: "트레이시의 원목 오르골 x1", limit: "일 1회", important: true }
        ]
      }
    ],
    "던바튼": [
      {
        npc: "네리스",
        exchanges: [
          { give: "동 광석 x1", receive: "상급 생가죽 x1", limit: "일 10회", important: false },
          { give: "합금강괴 x2", receive: "특수강괴 x1", limit: "일 4회", important: true }
        ]
      },
      {
        npc: "발터",
        exchanges: [
          { give: "트레이시의 원목 오르골 x1", receive: "상급 목재 x16", limit: "일 2회", important: true }
        ]
      },
      {
        npc: "아란웬",
        exchanges: [
          { give: "감자 샐러드 x2", receive: "궁극기 비약 x1", limit: "일 1회", important: false }
        ]
      },
      {
        npc: "제롬",
        exchanges: [
          { give: "크림소스 스테이크 x1", receive: "상급 실크 x4", limit: "일 1회", important: true }
        ]
      },
      {
        npc: "제이미",
        exchanges: [
          { give: "사과 생크림 케이크 x1", receive: "상급 옷감+ x4", limit: "일 1회", important: false }
        ]
      },
      {
        npc: "글리니스",
        exchanges: [
          { give: "생크림 x4", receive: "글리니스의 애플 밀크티 x1", limit: "일 1회", important: false }
        ]
      },
      {
        npc: "칼릭스",
        exchanges: [
          { give: "글리니스의 애플 밀크티 x3", receive: "상급 목재+ x12", limit: "일 2회", important: false }
        ]
      }
    ]
  };

  // 완료한 교환 목록을 저장하는 상태
  const [completedExchanges, setCompletedExchanges] = useState({});
  // 활성화된 지역 탭
  const [activeRegion, setActiveRegion] = useState("티르코네일");
  // 중요 교환만 보기 필터
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  // 리셋 시간까지 남은 시간
  const [timeUntilReset, setTimeUntilReset] = useState("");

  // 로컬 스토리지에서 완료한 교환 데이터 불러오기
  useEffect(() => {
    const savedCompletedExchanges = localStorage.getItem('completedExchanges');
    const savedResetDate = localStorage.getItem('resetDate');
    
    // 현재 날짜 가져오기
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(6, 0, 0, 0);
    
    // 현재 시간이 오전 6시 이후라면 다음날 오전 6시가 리셋 시간
    if (now > resetTime) {
      resetTime.setDate(resetTime.getDate() + 1);
    }
    
    // 저장된 리셋 날짜가 현재 리셋 날짜보다 이전이면 모든 체크 초기화
    if (!savedResetDate || new Date(savedResetDate) < resetTime) {
      localStorage.setItem('resetDate', resetTime.toISOString());
      localStorage.setItem('completedExchanges', JSON.stringify({}));
      setCompletedExchanges({});
    } else if (savedCompletedExchanges) {
      setCompletedExchanges(JSON.parse(savedCompletedExchanges));
    }
    
    // 리셋 시간까지 남은 시간 계산 함수
    const updateTimeUntilReset = () => {
      const now = new Date();
      const resetTime = new Date(now);
      resetTime.setHours(6, 0, 0, 0);
      
      if (now > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1);
      }
      
      const diff = resetTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}시간 ${minutes}분`);
    };
    
    // 초기 업데이트 및 1분마다 업데이트
    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // 체크박스 상태 변경 처리
  const handleCheckboxChange = (region, npcIndex, exchangeIndex) => {
    const exchangeKey = `${region}-${npcIndex}-${exchangeIndex}`;
    const newCompletedExchanges = { ...completedExchanges };
    
    if (newCompletedExchanges[exchangeKey]) {
      delete newCompletedExchanges[exchangeKey];
    } else {
      newCompletedExchanges[exchangeKey] = true;
    }
    
    setCompletedExchanges(newCompletedExchanges);
    localStorage.setItem('completedExchanges', JSON.stringify(newCompletedExchanges));
  };

  // 교환 항목 체크 여부 확인
  const isExchangeCompleted = (region, npcIndex, exchangeIndex) => {
    const exchangeKey = `${region}-${npcIndex}-${exchangeIndex}`;
    return !!completedExchanges[exchangeKey];
  };

  // 지역별 교환 완료 현황 계산
  const getRegionProgress = (region) => {
    let completed = 0;
    let total = 0;
    
    exchangeData[region].forEach((npc, npcIndex) => {
      npc.exchanges.forEach((exchange, exchangeIndex) => {
        if (!showImportantOnly || exchange.important) {
          total++;
          if (isExchangeCompleted(region, npcIndex, exchangeIndex)) {
            completed++;
          }
        }
      });
    });
    
    return { completed, total };
  };

  // 전체 교환 완료 현황 계산
  const getTotalProgress = () => {
    let completed = 0;
    let total = 0;
    
    Object.keys(exchangeData).forEach(region => {
      const progress = getRegionProgress(region);
      completed += progress.completed;
      total += progress.total;
    });
    
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const totalProgress = getTotalProgress();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold text-center">마비노기 모바일 일일 교환 트래커</h1>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm">다음 리셋까지: {timeUntilReset}</div>
          <div className="text-sm">전체 진행률: {totalProgress.completed}/{totalProgress.total} ({totalProgress.percentage}%)</div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 flex-grow">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(exchangeData).map(region => {
              const progress = getRegionProgress(region);
              return (
                <button
                  key={region}
                  className={`px-4 py-2 rounded-md ${activeRegion === region ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveRegion(region)}
                >
                  {region} ({progress.completed}/{progress.total})
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={showImportantOnly}
                onChange={() => setShowImportantOnly(!showImportantOnly)}
              />
              <span className="ml-2">중요 교환만 보기</span>
            </label>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {exchangeData[activeRegion].map((npc, npcIndex) => {
            // 필터링된 교환 항목 (중요 항목만 표시 옵션 적용)
            const filteredExchanges = npc.exchanges.filter(exchange => !showImportantOnly || exchange.important);
            
            // 표시할 교환 항목이 없으면 NPC 표시하지 않음
            if (filteredExchanges.length === 0) return null;
            
            return (
              <div key={npcIndex} className="border-b last:border-b-0">
                <div className="p-4 bg-gray-50 font-semibold">{npc.npc}</div>
                <div className="divide-y">
                  {filteredExchanges.map((exchange, exchangeIndex) => {
                    const actualExchangeIndex = npc.exchanges.findIndex(e => e === exchange);
                    const isCompleted = isExchangeCompleted(activeRegion, npcIndex, actualExchangeIndex);
                    
                    return (
                      <div 
                        key={exchangeIndex}
                        className={`p-4 flex items-center ${isCompleted ? 'bg-green-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 rounded"
                          checked={isCompleted}
                          onChange={() => handleCheckboxChange(activeRegion, npcIndex, actualExchangeIndex)}
                        />
                        <div className="ml-3 flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                              {exchange.give} 
                              <span className="mx-2">→</span> 
                              {exchange.receive}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {exchange.limit}
                            </span>
                            {exchange.important && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                중요
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 마비노기 모바일 교환 트래커 | 매일 오전 6시 초기화</p>
      </footer>
    </div>
  );
};

export default MabinogiExchangeTracker;